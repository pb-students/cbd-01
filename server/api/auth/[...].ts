import CredentialsProvider from '@auth/core/providers/credentials'
import type { User } from '@auth/core/types'
import type { AuthConfig } from '@auth/core'
import { CredentialsSignin } from '@auth/core/errors'
import { NuxtAuthHandler } from '#auth'
import { db, users, credentialsSchema, userSchema, loginAttempts } from '~/db'
import { eq, desc } from 'drizzle-orm'

const DELAY_BASE_MS = 5000

const runtimeConfig = useRuntimeConfig()

class TooManyAttemptsError extends CredentialsSignin {
  code = 'Too many login attempts, account locked'
}

class InvalidCredentialsError extends CredentialsSignin {
  code = 'Invalid credentials'
}

export const authOptions: AuthConfig = {
  basePath: '/api/auth',
  secret: runtimeConfig.authJs.secret,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Login', type: 'text', placeholder: 'Login' },
        password: { label: 'Hasło', type: 'password', placeholder: 'Hasło' }
      },

      async authorize (credentials) {
        const data = credentialsSchema.parse(credentials)

        const user = db.select()
          .from(users)
          .where(eq(users.username, data.username as string))
          .limit(1)
          .get()

        // Get last attempt
        const loginAttempt = db.select()
          .from(loginAttempts)
          .where(eq(loginAttempts.username, data.username as string))
          .orderBy(desc(loginAttempts.createdAt))
          .limit(1)
          .get()

        const failedAttempts = loginAttempt?.failedAttempts ?? 0
        const maxFailedAttempts = user?.maxFailedAttempts ?? 3

        const createAttempt = (failed: boolean) => db.insert(loginAttempts).values({
          userId: user?.id,
          username: data.username as string,
          failedAttempts: failed ? failedAttempts + 1 : 0,
          failed
        })

        // Artificial delay
        if (loginAttempt?.failed) {
          const timeoutMs = Math.min(loginAttempt.failedAttempts, maxFailedAttempts) * DELAY_BASE_MS
          console.warn(`Artificaial login delay for user '${data.username}': ${timeoutMs}ms`)
          await new Promise(resolve => setTimeout(resolve, timeoutMs))
        }

        // Limit attempts
        if (failedAttempts >= maxFailedAttempts) {
          console.error(`Warning: Too many login attempts for user '${data.username}'. Locking account.`)
          throw new TooManyAttemptsError()
        }

        // Log in user
        if (user) {
          if (user.password === data.password) {
            await createAttempt(false)
            return userSchema.parse(user) as unknown as User
          }
        }

        // Log failed attempt
        await createAttempt(true)
        if (failedAttempts + 1 >= maxFailedAttempts) {
          console.error(`Warning: Login attempt for a locked user '${data.username}'.`)
          throw new TooManyAttemptsError()
        }

        console.error(`Warning: Malicious login attempt for user '${data.username}' registered, bad credentials provided`)
          throw new InvalidCredentialsError()
      }

    })
  ],
  callbacks: {
    async jwt ({ token, user }) {
      if (user) {
        token.id = user.id as unknown as number
        token.username = user.username
      }

      return token
    },

    async session ({ session, token }) {
      if (token.id && token.username) {
        session.user = {
          id: token.id as unknown as string,
          username: token.username
        }
      }

      return session
    }
  }
}

export default NuxtAuthHandler(authOptions, runtimeConfig)

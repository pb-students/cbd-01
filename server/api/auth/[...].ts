import CredentialsProvider from '@auth/core/providers/credentials'
import type { AuthConfig, User } from '@auth/core/types'
import { NuxtAuthHandler } from '#auth'
import { db, users, userSchema } from '~/db'
import { eq } from 'drizzle-orm'

const runtimeConfig = useRuntimeConfig()

const credentialsSchema = userSchema.pick({
  username: true,
  password: true
})

export const authOptions: AuthConfig = {
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
          .get()

        if (user) {
          if (user.password === data.password) {
            return userSchema.parse(user) as unknown as User
          }
        }

        console.error('Warning: Malicious login attempt registered, bad credentials provided')
        throw new Error('Invalid credentials')
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

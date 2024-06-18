import { db, users, loginAttempts, userSchema, partialPasswords, eq } from '~/db'
import { passwordSchema } from '~/server/utils/password'

const schema = userSchema.extend({ password: passwordSchema }).omit({ id: true })

export default defineEventHandler(async (event) => {
  const user = await readValidatedBody(event, body => schema.safeParseAsync(body))
  if (!user.success) throw user.error

  await db.delete(loginAttempts).where(eq(loginAttempts.username, user.data.username)).execute()



  const [newUser] = await db.insert(users).values(user.data).returning()
  await db.insert(partialPasswords)
    .values(user.data.password.map(password => ({
      ...password,
      userId: newUser.id
    })))

  return newUser
})

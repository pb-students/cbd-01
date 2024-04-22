import { db, users, loginAttempts, userSchema, eq } from '~/db'

export default defineEventHandler(async (event) => {
  const user = await readValidatedBody(event, body => userSchema.safeParse(body))
  if (!user.success) throw user.error
  await db.delete(loginAttempts).where(eq(loginAttempts.username, user.data.username)).execute()
  return db.insert(users).values(user.data)
})

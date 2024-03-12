import { db, users, userSchema } from '~/db'

export default defineEventHandler(async (event) => {
  const user = await readValidatedBody(event, body => userSchema.safeParse(body))
  if (!user.success) throw user.error
  return db.insert(users).values(user.data)
})

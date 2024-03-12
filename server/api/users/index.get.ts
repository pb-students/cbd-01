import { db, users, userSchema } from '~/db'

export default defineEventHandler(async () => {
  const allUsers = db.select().from(users).all()
  const schema = userSchema.omit({ password: true })
  return allUsers.map(user => schema.parse(user))
})

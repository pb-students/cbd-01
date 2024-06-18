import { db, users, userSchema } from '~/db'

export default defineEventHandler(async () => {
  const allUsers = db.select().from(users).all()
  return allUsers.map(user => userSchema.parse(user))
})

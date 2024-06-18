import { db, eq, users, userSchema } from '~/db'
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw new Error('No id provided')

  const user = db.select()
    .from(users)
    .where(eq(users.id, +id))
    .get()

  return userSchema.parse(user)
})

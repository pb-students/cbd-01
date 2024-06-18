import { db, eq, users, userSchema } from '~/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw new Error('No id provided')

  const user = await db.delete(users).where(eq(users.id, +id))
  if (!user) throw new Error('No user found')

  return userSchema.parse(user)
})

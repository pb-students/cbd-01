import { db, eq, users, userSchema } from '~/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw new Error('No id provided')

  const schema = userSchema.partial()

  const data = await readValidatedBody(event, body => schema.safeParse(body))
  if (!data.success) throw data.error

  return db.update(users)
    .set(data.data)
    .where(eq(users.id, +id))
})

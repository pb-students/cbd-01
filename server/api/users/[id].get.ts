import { db, eq, users, userSchema } from '~/db'
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string

  const user = userSchema.parse(
    db.select()
      .from(users)
      .where(eq(users.id, +id))
      .get()
  )

  return { user }
})

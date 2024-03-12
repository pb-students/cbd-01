import { db, eq, messages, canEdit, messageSchema } from '~/db'
import { and } from 'drizzle-orm'

import { authOptions } from '~/server/api/auth/[...]'
import { getServerToken } from '#auth'

export default defineEventHandler(async (event) => {
  const jwt = await getServerToken(event, authOptions)
  if (!jwt?.id) throw new Error('Unauthorized')

  const id = getRouterParam(event, 'id')
  if (!id) throw new Error('No id provided')

  const schema = messageSchema.omit({ userId: true, updatedAt: true }).partial()
  const data = await readValidatedBody(event, body => schema.safeParse(body))
  if (!data.success) throw data.error

  const message = db.select()
    .from(messages)
    .where(eq(messages.id, +id))
    .get()

  // NOTE: Check permission if not the owner of the message
  if (message && message.userId !== jwt.id) {
    const hasPermission = db.select()
      .from(canEdit)
      .where(and(
        eq(canEdit.userId, jwt.id),
        eq(canEdit.messageId, message.id)
      ))
      .get()

    if (!hasPermission) {
      throw new Error('Unauthorized')
    }
  }

  return db.update(messages)
    .set({
      ...data.data,
      updatedAt: new Date().toISOString()
    })
    .where(eq(messages.id, +id))
})

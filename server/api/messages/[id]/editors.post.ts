import { db, eq, messages, canEdit } from '~/db'
import { z } from 'zod'

import { authOptions } from '~/server/api/auth/[...]'
import { getServerToken } from '#auth'

export default defineEventHandler(async (event) => {
  const jwt = await getServerToken(event, authOptions)
  if (!jwt?.id) throw new Error('Unauthorized')

  const id = getRouterParam(event, 'id')
  if (!id) throw new Error('No id provided')

  const message = db.select()
    .from(messages)
    .where(eq(messages.id, +id))
    .get()

  if (message?.userId !== jwt.id) throw new Error('Unauthorized')

  const schema = z.array(z.number())
  const editors = await readValidatedBody(event, body => schema.parse(body))

  await db.delete(canEdit)
    .where(eq(canEdit.messageId, +id))

  await db.insert(canEdit)
    .values(editors.map(userId => ({ userId, messageId: +id })))

  return editors
})

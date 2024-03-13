import { db, eq, messages } from '~/db'
import { and } from 'drizzle-orm'

import { authOptions } from '~/server/api/auth/[...]'
import { getServerToken } from '#auth'

export default defineEventHandler(async (event) => {
  const jwt = await getServerToken(event, authOptions)
  if (!jwt?.id) throw new Error('Unauthorized')

  const id = getRouterParam(event, 'id')
  if (!id) throw new Error('No id provided')

  const message = await db.delete(messages).where(and(
    eq(messages.id, +id),
    eq(messages.userId, jwt.id)
  ))

  if (!message) throw new Error('No message found')
})

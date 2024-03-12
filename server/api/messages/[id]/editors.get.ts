import { db, eq, canEdit } from '~/db'

import { authOptions } from '~/server/api/auth/[...]'
import { getServerToken } from '#auth'

export default defineEventHandler(async (event) => {
  const jwt = await getServerToken(event, authOptions)
  if (!jwt?.id) throw new Error('Unauthorized')

  const id = getRouterParam(event, 'id')
  if (!id) throw new Error('No id provided')

  const editors = db.select()
    .from(canEdit)
    .where(eq(canEdit.messageId, +id))
    .all()

  return editors.map(({ userId }) => userId)
})

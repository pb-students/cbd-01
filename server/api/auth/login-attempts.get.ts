import { db, eq, loginAttempts } from '~/db'

import { authOptions } from '~/server/api/auth/[...]'
import { getServerToken } from '#auth'

export default defineEventHandler(async (event) => {
  const jwt = await getServerToken(event, authOptions)
  if (!jwt?.id) throw new Error('Unauthorized')

  const attempts = db.select()
    .from(loginAttempts)
    .where(eq(loginAttempts.userId, +jwt.id))
    .get()

  return attempts
})

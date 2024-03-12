import { getServerSession } from '#auth'
import { authOptions } from '../api/auth/[...]'

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'GET' && !event.path?.startsWith('/api/auth')) {
    const session = await getServerSession(event, authOptions)
    console.log('session', session)
    if (!session) {
      throw createError({ statusMessage: 'Unauthenticated', statusCode: 403 })
    }
  }
})

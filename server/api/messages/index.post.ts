import { db, messages, messageSchema } from '~/db'
import { authOptions } from '~/server/api/auth/[...]'
import { getServerToken } from '#auth'

export default defineEventHandler(async (event) => {
  const jwt = await getServerToken(event, authOptions)
  if (!jwt?.id) throw new Error('Unauthorized')

  const schema = messageSchema.omit({ userId: true, updatedAt: true })
  const message = await readValidatedBody(event, body => schema.safeParse(body))
  if (!message.success) throw message.error

  return db.insert(messages).values({
    userId: jwt.id,
    ...message.data
  })
})

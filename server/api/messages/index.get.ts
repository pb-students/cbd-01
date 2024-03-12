import { db, messages, messageSchema } from '~/db'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const querySchema = z.object({
    page: z.number().default(0)
  })

  const validator = await getValidatedQuery(event, body => querySchema.safeParse(body))
  if (!validator.success) throw validator.error
  const query = validator.data

  const paginatedMessages = db.select()
    .from(messages)
    .orderBy(messages.createdAt)
    .limit(10)
    .offset(10 * query.page)
    .all()

  return paginatedMessages.map(msg => messageSchema.parse(msg))
})

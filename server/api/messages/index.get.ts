import { db, users, userSchema, messages, messageSchema, canEdit } from '~/db'
import { desc } from 'drizzle-orm'
import { z } from 'zod'

const PAGE_SIZE = 1000

const querySchema = z.object({
  page: z.coerce.number().default(0)
})

const fullMessageSchema = messageSchema
  .extend({
    createdAt: z.coerce.date(),
    id: z.number(),
    user: userSchema,
    editors: z.array(userSchema)
  })

export type Message = z.infer<typeof fullMessageSchema>

export default defineEventHandler(async (event) => {
  const validator = await getValidatedQuery(event, body => querySchema.safeParse(body))
  if (!validator.success) throw validator.error
  const query = validator.data

  const paginatedMessages = db.select()
    .from(messages)
    .orderBy(desc(messages.createdAt))
    .limit(PAGE_SIZE)
    .offset(PAGE_SIZE * query.page)
    .all()

  const allUsers = db.select()
    .from(users)
    .all()
    .reduce<Record<number, any>>((acc, user) => {
      acc[user.id] = user
      return acc
    }, {})

  const editors = db.select()
    .from(canEdit)
    .all()
    .reduce<Record<number, any>>((acc, editor) => {
      if (!editor.messageId || !editor.userId) return acc
      acc[editor.messageId] ??= []
      acc[editor.messageId].push(allUsers[editor.userId])
      return acc
    }, {})

  return paginatedMessages.map(msg => fullMessageSchema.parse({
    ...msg,
    user: allUsers[msg.userId ?? 0],
    editors: editors[msg.id] ?? []
  }))
})

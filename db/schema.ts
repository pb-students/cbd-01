import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'

export const messageSchema = z.object({
  userId: z.number(),
  message: z.string()
})

export const canEditSchema = z.object({
  userId: z.number(),
  messageId: z.number()
})

export const credentialsSchema = z.object({
  username: z.string(),
  password: z.string()
})

export const userSchema = z.object({
  id: z.number(),
  username: z.string()
})

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
})

export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  message: text('message').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
})

export const canEdit = sqliteTable('can_edit', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  messageId: integer('message_id').references(() => messages.id)
})

import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'

export const messageSchema = z.object({
  userId: z.number(),
  message: z.string(),
  updatedAt: z.coerce.date().nullable()
})

export const canEditSchema = z.object({
  userId: z.number(),
  messageId: z.number()
})

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
})

export const credentialsSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  username: text('username').notNull(),
  maxFailedAttempts: integer('max_failed_attempts').notNull().default(99999),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
})

export const loginAttempts = sqliteTable('login_attempts', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  username: text('username').notNull(),
  failed: integer('failed', { mode: 'boolean' }).default(false).notNull(),
  failedAttempts: integer('failed_attempts').default(0).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
})

export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
})

export const canEdit = sqliteTable('can_edit', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  messageIduserId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' })
})

export const partialPasswords = sqliteTable('partial_passwords', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  hashedPassword: text('hashed_password').notNull(),
  k: integer('k').notNull(),
  i: integer('i').notNull(),
})

import config from '~/drizzle.config'
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'

export const sqlite = new Database(config.dbCredentials.url)
export const db: BetterSQLite3Database = drizzle(sqlite)
export * from './schema'
export { eq } from 'drizzle-orm'

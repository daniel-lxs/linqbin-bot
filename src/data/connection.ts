import type { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

const db = new Database('./src/data/sqlite.db', { create: true });

export function getDb(): BunSQLiteDatabase {
  if (!db) {
    throw new Error('Connection: Database is invalid or nonexistent');
  }
  return drizzle(db);
}

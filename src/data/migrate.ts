import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import fs from 'node:fs';

export async function migrateDb() {
  try {
    if (!fs.existsSync('./db')) {
      fs.mkdirSync('./db');
    }

    const sqlite = new Database('./db/sqlite.db', { create: true });
    const db = drizzle(sqlite);
    await migrate(db, { migrationsFolder: './drizzle' });
  } catch (error) {
    console.error('Error migrating database:', error);
  }
}

migrateDb();

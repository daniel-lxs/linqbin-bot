import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const dndEntrySchema = sqliteTable('dndEntries', {
  id: integer('id').primaryKey().notNull(),
  userId: text('userId').unique().notNull(),
  enabled: integer('enabled', { mode: 'boolean' }).notNull(),
  createdOn: integer('createdOn', { mode: 'timestamp' }).notNull(),
});

export type DnDEntry = {
  id: number;
  userId: string;
  enabled: boolean;
  createdOn: number;
};

export type NewDnDEntry = Omit<DnDEntry, 'id'>;

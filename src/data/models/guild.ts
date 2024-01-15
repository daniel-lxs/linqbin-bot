import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const guildSchema = sqliteTable('guilds', {
  id: integer('id').primaryKey(),
  guildId: text('guildId').notNull().unique(),
  guildOwnerId: text('guildOwnerId').notNull(),
  logChannelId: text('logChannelId'),
  ownerRoleId: text('ownerRoleId'),
  name: text('name').notNull(),
  disabledCommands: text('disabledCommands'),
});

export type Guild = {
  id: number;
  guildId: string;
  guildOwnerId: string;
  logChannelId?: string;
  ownerRoleId?: string;
  name: string;
  disabledCommands?: string[];
};

import type { Guild } from 'discord.js';

export type NewGuild = Pick<Guild, 'id' | 'name' | 'ownerId'>;

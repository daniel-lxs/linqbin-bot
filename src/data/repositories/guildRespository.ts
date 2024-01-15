import { eq } from 'drizzle-orm';
import type { NewGuild } from '../../types/NewGuild';
import { assertEntity } from '../../util';
import { getDb } from '../connection';
import { guildSchema, type Guild } from '../models/guild';

export function createGuild({ id, name, ownerId }: NewGuild) {
  try {
    const guild = findGuildByGuildId(id);
    if (guild) {
      return guild;
    }

    const db = getDb();

    const result = db
      .insert(guildSchema)
      .values({
        name,
        guildOwnerId: ownerId,
        guildId: id,
      })
      .onConflictDoNothing()
      .returning()
      .all()[0];

    if (
      assertEntity<Guild>(result, ['id', 'guildId', 'name', 'guildOwnerId'])
    ) {
      return {
        id: result.id,
        guildId: result.guildId,
        name: result.name,
        guildOwnerId: result.guildOwnerId,
      };
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}

export function findGuildByGuildId(guildId: string): Guild | null {
  try {
    const db = getDb();
    const result = db
      .select()
      .from(guildSchema)
      .where(eq(guildSchema.guildId, guildId))
      .all()[0];

    if (assertEntity(result, ['id', 'guildId', 'name', 'guildOwnerId'])) {
      return {
        id: result.id,
        guildId: result.guildId,
        name: result.name,
        guildOwnerId: result.guildOwnerId,
      };
    }
    return null;
  } catch (error) {
    console.error('Error finding guild:', error);
    return null;
  }
}

export function addLogChannelToGuild(guildId: string, logChannelId: string) {
  try {
    const db = getDb();

    const guild = findGuildByGuildId(guildId);

    if (!guild) {
      return false;
    }

    db.update(guildSchema)
      .set({ logChannelId })
      .where(eq(guildSchema.guildId, guildId))
      .run();

    return true;
  } catch (error) {
    console.error('Error adding log channel to guild:', error);
    return false;
  }
}

export function addOwnerRoleIdToGuild(guildId: string, ownerRoleId: string) {
  try {
    const guild = findGuildByGuildId(guildId);
    if (!guild) {
      return false;
    }

    const db = getDb();
    db.update(guildSchema)
      .set({ ownerRoleId })
      .where(eq(guildSchema.guildId, guildId))
      .run();

    return true;
  } catch (error) {
    console.error('Error adding owner role to guild:', error);
    return false;
  }
}

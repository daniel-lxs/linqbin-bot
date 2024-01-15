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
      const disabledCommands = result.disabledCommands
        ? result.disabledCommands.split(',')
        : undefined;
      return {
        id: result.id,
        guildId: result.guildId,
        name: result.name,
        guildOwnerId: result.guildOwnerId,
        disabledCommands: disabledCommands,
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
        ownerRoleId: result.ownerRoleId || undefined,
        logChannelId: result.logChannelId || undefined,
        disabledCommands: result.disabledCommands
          ? result.disabledCommands.split(',')
          : undefined,
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

export function toggleGuildCommand(guildId: string, command: string) {
  try {
    const guild = findGuildByGuildId(guildId);
    if (!guild) {
      return false;
    }

    const db = getDb();
    //Delete command from disabledCommands if it exists
    if (guild.disabledCommands?.includes(command)) {
      const disabledCommands = guild.disabledCommands.filter(
        (c) => c !== command
      );
      db.update(guildSchema)
        .set({ disabledCommands: disabledCommands.join(',') })
        .where(eq(guildSchema.guildId, guildId))
        .run();
    } else {
      //Add command to disabledCommands if it doesn't exist
      const disabledCommands = guild.disabledCommands
        ? [...guild.disabledCommands, command]
        : [command];
      db.update(guildSchema)
        .set({ disabledCommands: disabledCommands.join(',') })
        .where(eq(guildSchema.guildId, guildId))
        .run();
    }

    return true;
  } catch (error) {
    console.error('Error toggling guild command:', error);
    return false;
  }
}

export function isCommandDisabled(guildId: string, command: string) {
  try {
    const guild = findGuildByGuildId(guildId);
    if (!guild) {
      return false;
    }
    return guild.disabledCommands?.includes(command) ?? false;
  } catch (error) {
    console.error('Error checking if command is disabled:', error);
    return false;
  }
}

export function isMemberGuildOwner(guildId: string, roleIds: string[]) {
  try {
    console.debug('Checking if member is guild owner:', guildId, roleIds);
    const guild = findGuildByGuildId(guildId);
    if (!guild) {
      return false;
    }
    console.debug('Guild owner role:', guild.ownerRoleId);
    if (!guild.ownerRoleId) {
      return false;
    }
    console.log('Checking if role is guild owner:', guild.ownerRoleId);
    return roleIds.includes(guild.ownerRoleId);
  } catch (error) {
    console.error('Error checking if role is guild owner:', error);
    return false;
  }
}

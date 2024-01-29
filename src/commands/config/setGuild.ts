import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import {
  isMemberGuildOwner,
  createGuild,
} from '../../data/repositories/guildRespository';
import type { Command } from '../../types/Command';

const setGuild: Command = {
  data: new SlashCommandBuilder()
    .setName('set-guild')
    .setDescription('Sets up the current guild'),
  execute: async (interaction: CommandInteraction) => {
    const guild = interaction.guild;

    if (!guild || !interaction.inCachedGuild()) {
      await interaction.reply('This command can only be used in a guild!');
      return;
    }

    const memberRoles = interaction.member?.roles.cache.map((role) => role.id);

    if (!memberRoles) {
      await interaction.reply(
        'You do not have permission to use this command!'
      );
      return;
    }

    const isGuildOwner = isMemberGuildOwner(
      interaction.guildId as string,
      memberRoles
    );

    const highestRole = guild.roles.highest;

    if (!isGuildOwner && !highestRole) {
      await interaction.reply(
        'You do not have permission to use this command!'
      );
      return;
    }

    createGuild({
      id: guild.id,
      name: guild.name,
      ownerId: guild.ownerId,
    });

    await interaction.reply('Guild set!');
    return;
  },
};

export default setGuild;

import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import {
  isMemberGuildOwner,
  addOwnerRoleIdToGuild,
  findGuildByGuildId,
} from '../../data/repositories/guildRespository';
import type { Command } from '../../types/Command';

const setThis: Command = {
  data: new SlashCommandBuilder()
    .setName('set-owner-role')
    .setDescription('Sets the owner role')
    .addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('The role to be set as owner')
        .setRequired(true)
    ),
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

    const savedGuild = findGuildByGuildId(interaction.guildId as string);

    if (!savedGuild) {
      await interaction.reply({
        content: 'Please use /set-guild first!',
        ephemeral: true,
      });
      return;
    }

    const roleId = interaction.options.get('role')?.role?.id;

    if (!roleId) {
      await interaction.reply('This command requires a role ID!');
      return;
    }

    const result = await addOwnerRoleIdToGuild(guild.id, roleId);

    if (!result) {
      await interaction.reply('Failed to set owner role!');
      return;
    }

    await interaction.reply('Owner role set!');
    return;
  },
};

export default setThis;

import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import {
  addLogChannelToGuild,
  addOwnerRoleIdToGuild,
  createGuild,
} from '../../data/repositories/guildRespository';
import type { Command } from '../../types/Command';

const options = [
  {
    name: 'guild',
    value: 'guild',
  },
  {
    name: 'logs-channel',
    value: 'logs-channel',
  },
  {
    name: 'owner-role',
    value: 'owner-role',
  },
];

const setThis: Command = {
  data: new SlashCommandBuilder()
    .setName('set-this')
    .setDescription('Sets the current guild, channel, or role as needed.')
    .addStringOption((option) =>
      option
        .setName('option')
        .setDescription('The option to set.')
        .setRequired(true)
        .addChoices(...options)
    )
    .addStringOption((option) =>
      option
        .setName('value')
        .setDescription('The value to set.')
        .setRequired(false)
    ),
  execute: async (interaction: CommandInteraction) => {
    const option = interaction.options.get('option')?.value as string;
    switch (option) {
      case 'guild':
        const guild = interaction.guild;

        if (!guild) {
          await interaction.reply('This command can only be used in a guild!');
          return;
        }

        createGuild({
          id: guild.id,
          name: guild.name,
          ownerId: guild.ownerId,
        });

        await interaction.reply('Guild set!');
        break;
      case 'logs-channel':
        const guildId = interaction.guildId;
        const value = interaction.options.get('value')?.value as string;
        const channelId = value || interaction.channelId;

        if (!channelId || !guildId) {
          await interaction.reply(
            'This command can only be used in a channel!'
          );
          return;
        }

        const result = await addLogChannelToGuild(guildId, channelId);

        if (!result) {
          await interaction.reply('Failed to set logs channel!');
          return;
        }

        await interaction.reply('Logs channel set!');
        break;
      case 'owner-role':
        const roleId = interaction.options.get('value')?.value as string;
        const guildId2 = interaction.guildId;

        if (!roleId) {
          await interaction.reply('This command requires a role ID!');
          return;
        }

        if (!guildId2) {
          await interaction.reply('This command can only be used in a guild!');
          return;
        }

        const result2 = await addOwnerRoleIdToGuild(guildId2, roleId);

        if (!result2) {
          await interaction.reply('Failed to set owner role!');
          return;
        }

        await interaction.reply('Owner role set!');
        break;
    }
  },
};

export default setThis;

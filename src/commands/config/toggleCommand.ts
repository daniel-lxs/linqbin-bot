import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import {
  isMemberGuildOwner,
  toggleGuildCommand,
} from '../../data/repositories/guildRespository';

const toggleCommand = {
  data: new SlashCommandBuilder()
    .setName('toggle-command')
    .setDescription('Toggles a command')
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('The command to toggle')
        .setRequired(true)
        .addChoices(
          { name: 'shorten', value: 'shorten' },
          { name: 'send-shorten', value: 'send-shorten' }
        )
    )
    .addBooleanOption((option) =>
      option
        .setName('enabled')
        .setDescription('Whether to enable or disable the command')
        .setRequired(true)
    ),

  execute: async (interaction: CommandInteraction) => {
    if (!interaction.guild || !interaction.inCachedGuild()) {
      await interaction.reply('This command can only be used in a guild!');
      return;
    }

    const memberRoles = interaction.member?.roles.cache.map((role) => role.id);

    if (!memberRoles) {
      await interaction.reply({
        content: 'You do not have permission to use this command!',
        ephemeral: true,
      });
      return;
    }

    const isGuildOwner = isMemberGuildOwner(
      interaction.guildId as string,
      memberRoles
    );

    if (!isGuildOwner) {
      await interaction.reply({
        content:
          'You do not have permission to use this command! Make sure to set this guild first using /set-this',
        ephemeral: true,
      });
      return;
    }

    const command = interaction.options.get('command')?.value as string;
    const enabled = interaction.options.get('enabled')?.value as boolean;

    if (!command || enabled === undefined) {
      await interaction.reply({
        content: 'Invalid arguments',
        ephemeral: true,
      });
      return;
    }

    toggleGuildCommand(interaction.guildId as string, command);

    if (enabled) {
      await interaction.reply({
        content: `${command} enabled`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `${command} disabled`,
        ephemeral: true,
      });
    }
  },
};

export default toggleCommand;

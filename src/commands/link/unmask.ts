import { SlashCommandBuilder, type CommandInteraction } from 'discord.js';
import { isCommandDisabled } from '../../data/repositories/guildRespository';
import type { Command, SlashCommand } from '../../types/Command';

const unmask: Command = {
  data: new SlashCommandBuilder()
    .setName('unmask')
    .setDescription('Unmasks that which was masked')
    .addStringOption((option) =>
      option
        .setName('key')
        .setDescription('The key to unmask')
        .setRequired(true)
    ),
  execute: async (
    interaction: CommandInteraction,
    commandData: SlashCommand
  ) => {
    const guild = interaction.guild;
    if (guild) {
      if (isCommandDisabled(interaction.guildId as string, commandData.name)) {
        await interaction.reply({
          content: 'This command is disabled',
          ephemeral: true,
        });
        return;
      }
    }

    let key = interaction.options.get('key')?.value as string;

    if (!key) {
      await interaction.reply({
        content: 'No key provided!',
        ephemeral: true,
      });
      return;
    }

    const regex = /^[a-zA-Z0-9]{6}\+[a-zA-Z0-9]{6}$/;
    const isKeyValid = regex.test(key);

    if (!isKeyValid) {
      await interaction.reply({
        content: 'Invalid key!',
        ephemeral: true,
      });
      return;
    }

    const frontendUrl = process.env.FRONTEND_URL;

    await interaction.reply({
      content: `${frontendUrl}/${key}`,
      ephemeral: true,
    });
  },
};

export default unmask;

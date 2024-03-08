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
        .setRequired(false)
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

    //get repliedTo message in case key is not provided
    if (!key) {
      const repliedTo = await interaction.fetchReply();
      if (repliedTo) {
        key = repliedTo.content;
      }
    }
    const regex = /^[a-zA-Z0-9]{3}\d{3}\+[a-zA-Z0-9]{3}\d{3}$/;
    const isKeyValid = regex.test(key);

    if (!key || !isKeyValid) {
      await interaction.reply({
        content: 'No key provided or invalid key!',
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

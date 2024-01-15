import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import type { Command } from '../../types/Command';

const ping: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply('Pong!');
  },
};

export default ping;

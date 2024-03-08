import type { CommandInteraction } from 'discord.js';
import type { Command } from '../../types/Command';
import { updateDndEntry } from '../../data/repositories/dndEntryRepository';

export const allowLinks: Command = {
  data: {
    name: 'allow-links',
    description:
      'Allows you to recieve links once again if you are in the do not disturb list',
  },
  execute: async function (interaction: CommandInteraction) {
    const guild = interaction.guild;
    const user = interaction.user;

    if (!user) {
      return;
    }

    updateDndEntry(user.id, false);

    await interaction.reply({
      content: 'You are no longer in the do not disturb list ✅',
      ephemeral: guild ? true : false,
    });
  },
};

export default allowLinks;

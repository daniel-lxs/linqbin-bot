import type { ButtonInteraction } from 'discord.js';
import {
  createDndEntry,
  isDndEnabled,
} from '../data/repositories/dndEntryRepository';

const dndButton = {
  data: {
    name: 'dnd-button',
  },
  execute: async (interaction: ButtonInteraction) => {
    const user = interaction.user;
    //Probably unnecessary
    if (!user) {
      return;
    }

    if (isDndEnabled(user.id)) {
      await interaction.reply({
        content: 'You are already in the do not disturb list',
      });
      return;
    }

    createDndEntry(user.id);

    console.log('[dndButton] Dnd entry created for user:', user.id);

    await interaction.update({
      content:
        'You are now in the do not disturb list, you will not receive links ✅',
      embeds: [],
      components: [],
    });

    return;
  },
};

export default dndButton;

import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../types/Command';
import { validateUrl } from '../../util';
import { getPageInfo } from '../../api/getPageInfo';
import { createNewEntry } from '../../api/createEntry';

const shorten: Command = {
  data: new SlashCommandBuilder()
    .setName('shorten')
    .setDescription('Shortens a url')
    .addStringOption((option) =>
      option
        .setName('url')
        .setDescription('The url to shorten')
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('ttl')
        .setDescription('The time to live in hours')
        .setMinValue(1)
        .setMaxValue(168)
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName('visit-limit')
        .setDescription('The visit count threshold')
        .setMinValue(0)
        .setMaxValue(100)
        .setRequired(false)
    ),
  execute: async (interaction) => {
    const apiUrl = process.env.API_URL;
    const url = interaction.options.get('url')?.value as string;
    const ttl = interaction.options.get('ttl')?.value as number;
    const visitCountThreshold = interaction.options.get('visit-limit')
      ?.value as number;

    if (!url) {
      await interaction.reply('No url provided!');
      return;
    }

    const isValidUrl = validateUrl(url);

    if (isValidUrl) {
      const title = await getPageInfo(url);

      const entry = await createNewEntry({
        title: title?.title || undefined,
        content: url,
        ttl: ttl || 1,
        visitCountThreshold: visitCountThreshold || 0,
      });

      if (!entry) {
        await interaction.reply({
          content: 'Failed to create entry',
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        content: `\`${apiUrl}${entry.slug}\``, // TODO
        ephemeral: true,
      });
    }

    if (!isValidUrl) {
      await interaction.reply({
        content: 'Invalid url provided!',
        ephemeral: true,
      });
    }
  },
};

export default shorten;

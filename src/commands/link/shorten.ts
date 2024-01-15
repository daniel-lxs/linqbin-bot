import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createNewEntry, getNewPasskey, getPageInfo } from '../../api';
import { isCommandDisabled } from '../../data/repositories/guildRespository';
import type { Command, SlashCommand } from '../../types/Command';
import { encryptContent, validateUrl } from '../../util';

const shorten: Command = {
  data: new SlashCommandBuilder()
    .setName('shorten')
    .setDescription('Shortens a url')
    .addStringOption((option) =>
      option
        .setName('url') //TODO: allow text or url
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

      const passkey = await getNewPasskey();

      if (!passkey) {
        await interaction.reply({
          content: 'Failed to create entry',
          ephemeral: true,
        });
        return;
      }

      const encryptedContent = encryptContent(url, passkey);

      const entry = await createNewEntry({
        title: title?.title || undefined,
        content: encryptedContent,
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
        content: `\`${apiUrl}/${entry.slug}+${passkey}\``, //TODO: add title and url without passkey
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

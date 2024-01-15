import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import type { Command, SlashCommand } from '../../types/Command';
import { encryptContent, validateUrl } from '../../util';
import { getPageInfo } from '../../api/getPageInfo';
import { createNewEntry } from '../../api/createEntry';
import { isCommandDisabled } from '../../data/repositories/guildRespository';
import { getNewPasskey } from '../../api';

const sendShorten: Command = {
  data: new SlashCommandBuilder()
    .setName('send-shorten')
    .setDescription('Sends a shortened url')
    .addStringOption((option) =>
      option
        .setName('url') //TODO: allow text or url
        .setDescription('The url to shorten')
        .setRequired(true)
    )
    .addUserOption((option) =>
      option.setName('target').setDescription('The user to send the link to')
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
  execute: async function (
    interaction: CommandInteraction,
    commandData: SlashCommand
  ) {
    if (!interaction.guild) {
      await interaction.reply('This command can only be used in a guild!');
      return;
    }

    if (isCommandDisabled(interaction.guildId as string, commandData.name)) {
      await interaction.reply({
        content: 'This command is disabled',
        ephemeral: true,
      });
      return;
    }

    const apiUrl = process.env.API_URL;
    const target = interaction.options.getUser('target');
    const url = interaction.options.get('url')?.value as string;
    const ttl = interaction.options.get('ttl')?.value as number;
    const visitCountThreshold = interaction.options.get('visit-limit')
      ?.value as number;

    if (!url) {
      await interaction.reply('No url provided!');
      return;
    }

    if (!target) {
      await interaction.reply('No target provided!');
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

      target.send(
        `Hi there, I'm Linqbin, ${interaction.user.username} has sent you a temporary link: \`${apiUrl}/${entry.slug}+${passkey}\`. If you didn't request this, please ignore this message.`
      );

      await interaction.reply({
        content: `Sent link to ${target}`, // TODO
        ephemeral: true,
      });
    }
  },
};

export default sendShorten;

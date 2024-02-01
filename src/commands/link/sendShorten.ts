import {
  SlashCommandBuilder,
  CommandInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from 'discord.js';
import type { Command, SlashCommand } from '../../types/Command';
import { encryptContent, validateUrl } from '../../util';
import { getPageInfo } from '../../api/getPageInfo';
import { createNewEntry } from '../../api/createEntry';
import {
  findGuildByGuildId,
  isCommandDisabled,
} from '../../data/repositories/guildRespository';
import { isDndEnabled } from '../../data/repositories/dndEntryRepository';

const sendShorten: Command = {
  data: new SlashCommandBuilder()
    .setName('send-shorten')
    .setDescription('Sends a shortened url to another member of the server')
    .addStringOption((option) =>
      option
        .setName('url') //TODO: allow text or url
        .setDescription('The url to shorten')
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('The user to send the link to')
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
    )
    .addStringOption((option) =>
      option
        .setName('title')
        .setDescription('The title of the link')
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

    const savedGuild = findGuildByGuildId(interaction.guildId as string);

    if (
      !savedGuild ||
      isCommandDisabled(interaction.guildId as string, commandData.name)
    ) {
      await interaction.reply({
        content: 'This command is disabled',
        ephemeral: true,
      });
      return;
    }

    const frontendUrl = process.env.FRONTEND_URL;
    const target = interaction.options.getUser('target');

    if (!target) {
      await interaction.reply('No target provided!');
      return;
    }

    if (isDndEnabled(target?.id)) {
      await interaction.reply({
        content: 'This user does not want to receive links',
        ephemeral: true,
      });
      return;
    }

    const url = interaction.options.get('url')?.value as string;
    const ttl = interaction.options.get('ttl')?.value as number;
    const title = interaction.options.get('title')?.value as string;
    const visitCountThreshold = interaction.options.get('visit-limit')
      ?.value as number;

    if (!url) {
      await interaction.reply('No url provided!');
      return;
    }

    const isValidUrl = validateUrl(url);

    if (isValidUrl) {
      const { encryptedContent, passkey } = encryptContent(url);

      const entry = await createNewEntry({
        title: title || undefined,
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

      const dndButton = new ButtonBuilder()
        .setCustomId('dnd-button')
        .setLabel("Don't send me links")
        .setStyle(ButtonStyle.Danger);
      const row = new ActionRowBuilder().addComponents(dndButton);

      target.send({
        embeds: [
          {
            title: `🔗 You received a link!`,
            description: `${entry.title || 'Untitled'}\n${frontendUrl}/${
              entry.slug
            }+${passkey}`,
            url: `${frontendUrl}/${entry.slug}+${passkey}`,
            color: 6169937,
            author: {
              name: interaction.user.tag,
              icon_url: interaction.user.displayAvatarURL(),
              url: frontendUrl,
            },
            footer: {
              text: `Powered by linqbin.cc`,
            },
            timestamp: new Date().toISOString(),
          },
        ],
        components: [row as any], //Due to some bug in discord.js types,
      });

      await interaction.reply({
        content: `Sent link to ${target}`,
        ephemeral: true,
      });
    }
  },
};

export default sendShorten;

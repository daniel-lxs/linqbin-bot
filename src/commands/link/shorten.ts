import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createNewEntry } from '../../api';
import { isCommandDisabled } from '../../data/repositories/guildRespository';
import type { Command, SlashCommand } from '../../types/Command';
import { encryptContent, validateUrl, hashPasskey } from '../../util';

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

    const frontendUrl = process.env.FRONTEND_URL;
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
      const { encryptedContent, passkey } = encryptContent(url);
      const protoHash = await hashPasskey(passkey);

      const entry = await createNewEntry({
        content: encryptedContent,
        ttl: ttl || 1,
        protoHash,
        visitCountThreshold: visitCountThreshold || 0,
      });

      if (!entry) {
        await interaction.reply({
          content: 'Failed to create entry',
          ephemeral: true,
        });
        return;
      }

      if (!isValidUrl) {
        await interaction.reply({
          content: 'Invalid url provided!',
          ephemeral: true,
        });
      }

      const linkWithPasskey = `${frontendUrl}/${entry.slug}+${passkey}`;
      const linkWithoutPasskey = `${frontendUrl}/${entry.slug}`;

      await interaction.reply({
        content: `🔗 Your short link is ready!\n\n**${
          entry.title || 'Untitled'
        }**\n[Link with passkey](${linkWithPasskey}) \`\`\`${linkWithPasskey}\`\`\`\n[Link without passkey](${linkWithoutPasskey}) \`\`\`${linkWithoutPasskey}\`\`\`\n_\n`,
        embeds: [
          {
            title: 'Powered by linqbin.cc',
            url: 'https://linqbin.cc',
            color: 6169937,
          },
        ],
        ephemeral: true,
      });
    }
  },
};

export default shorten;

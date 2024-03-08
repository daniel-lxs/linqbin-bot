import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command, SlashCommand } from '../../types/Command';
import { createNewEntry } from '../../api';
import { isCommandDisabled } from '../../data/repositories/guildRespository';
import { encryptContent, hashPasskey } from '../../util';

const mask: Command = {
  data: new SlashCommandBuilder()
    .setName('mask')
    .setDescription('Masks a text or url')
    .addStringOption((option) =>
      option
        .setName('content')
        .setDescription('The text or url to mask')
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

    const content = interaction.options.get('content')?.value as string;
    const ttl = interaction.options.get('ttl')?.value as number;
    const visitCountThreshold = interaction.options.get('visit-limit')
      ?.value as number;

    if (!content) {
      await interaction.reply('No content provided!');
      return;
    }

    const { encryptedContent, passkey } = encryptContent(content);
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

    const key = `${entry.slug}+${passkey}`;

    await interaction.reply({
      content: `🔒 Your masked text is ready!\n\n\`\`\`${key}\`\`\`\n.`,
      embeds: [
        {
          title: 'Powered by linqbin.cc',
          url: 'https://linqbin.cc',
          color: 6169937,
        },
      ],
      ephemeral: true,
    });
  },
};

export default mask;

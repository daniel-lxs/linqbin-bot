import type { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export type SlashCommand =
  | SlashCommandBuilder
  | (Partial<SlashCommandBuilder> & {
      name: string;
      description: string;
    });

export type Command = {
  data: SlashCommand;
  execute: (
    interaction: CommandInteraction,
    commandData: SlashCommand
  ) => Promise<void>;
};

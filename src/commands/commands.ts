import { REST, Routes } from 'discord.js';
import type { Command } from '../types/Command';
import ping from './utility/ping';
import setGuild from './config/setGuild';
import shorten from './link/shorten';
import sendShorten from './link/sendShorten';
import toggleCommand from './config/toggleCommand';
import setOwnerRole from './config/setOwnerRole';
import { allowLinks } from './link/allowLinks';

export const commands: Record<string, Command> = {
  ping,
  [setGuild.data.name]: setGuild,
  [shorten.data.name]: shorten,
  [sendShorten.data.name]: sendShorten,
  [toggleCommand.data.name]: toggleCommand,
  [setOwnerRole.data.name]: setOwnerRole,
  [allowLinks.data.name]: allowLinks,
};

export async function deployCommands() {
  const commandData = Object.values(commands).map((command) => command.data);

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commandData,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

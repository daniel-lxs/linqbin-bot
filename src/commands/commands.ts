import { REST, Routes } from 'discord.js';
import type { Command } from '../types/Command';
import ping from './utility/ping';
import setThis from './utility/setThis';
import shorten from './link/shorten';
import sendShorten from './link/sendShorten';

export const commands: Record<string, Command> = {
  ping,
  //[setThis.data.name]: setThis,
  [shorten.data.name]: shorten,
  [sendShorten.data.name]: sendShorten,
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

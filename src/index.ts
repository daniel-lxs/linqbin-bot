import { Client, GatewayIntentBits } from 'discord.js';
import { commands, deployCommands } from './commands/commands';

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.on('ready', async () => {
  await deployCommands();
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  console.log(`Received interaction: ${interaction.id}`);
  if (!interaction.isCommand()) {
    return;
  }

  const { commandName } = interaction;
  const command = commands[commandName as keyof typeof commands];
  if (command) {
    console.log(`Running command: ${commandName}`);
    command.execute(interaction);
  }
});

client.login(process.env.TOKEN);

Bun.serve({
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  fetch: (req) => {
    if (req.method === 'GET' && req.url === '/health') {
      return new Response('OK', { status: 200 });
    }
    return new Response('Not found', { status: 404 });
  },
});

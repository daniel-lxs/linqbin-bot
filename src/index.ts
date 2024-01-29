import { Client, GatewayIntentBits } from 'discord.js';
import { deployCommands } from './commands/commands';
import interactionCreateListener from './events/interactionCreate';

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.on('ready', async () => {
  await deployCommands();
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', (...args) =>
  interactionCreateListener.execute(...args)
);

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

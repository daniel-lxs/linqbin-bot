import { Events, type Interaction } from 'discord.js';
import { commands } from '../commands/commands';
import { buttons } from '../buttons/buttons';

const interactionCreateListener = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    console.log(`Received interaction: ${interaction.id}`);
    if (interaction.isCommand()) {
      const { commandName } = interaction;
      const command = commands[commandName as keyof typeof commands];
      if (command) {
        console.log(`Running command: ${commandName}`);
        command.execute(interaction, command.data);
      }
    }
    if (interaction.isButton()) {
      const { customId } = interaction;
      const button = buttons[customId as keyof typeof buttons];
      if (button) {
        console.log(`Running button: ${customId}`);
        button.execute(interaction);
      }
    }
  },
};

export default interactionCreateListener;

import { Events } from "discord.js";
import rolesGuard from "../../utils/rolesGuard.js";

/**
 * Discord event, listen interactions.
 */
export default {
  name: Events.InteractionCreate,
  eventName: "interaction create",
  once: false,
  async execute(client, interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `[INTERACTION_EVENT] No command matching ${interaction.commandName} was found`
      );
      return;
    }

    if (
      command.allowedRoles &&
      !rolesGuard(command.allowedRoles, interaction)
    ) {
      await interaction.reply({
        content:
          "Vous n'avez pas le rôle nécessaire pour executer cette commande",
        ephemeral: true,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      await interaction.reply({
        content: "Une erreur est survenue dans l'execution de la commande",
        ephemeral: true,
      });
      console.error(
        `[INTERACTION_EVENT] An error occurred while executing command : ${command.name}\n`,
        error
      );
    }
  },
};

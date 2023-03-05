import { SlashCommandBuilder } from "discord.js";
import pollModalConfig from "./createPollModalConfig.js";
import modalService from "../../utils/modalService.js";

/**
 * Feature command, create the poll modal form.
 */
export default {
  data: new SlashCommandBuilder()
    .setName("creer_un_sondage")
    .setDescription("Créer un sondage"),
  async execute(interaction) {
    const pollModal = modalService.createModal(
      pollModalConfig.name,
      pollModalConfig.title
    );

    const pollModalFields = modalService.createModalFields(
      pollModalConfig.fields
    );

    const pollModalActionRows = modalService.createActionRows(pollModalFields);

    pollModal.addComponents(...pollModalActionRows);

    await interaction.showModal(pollModal);
  },
};

import { SlashCommandBuilder } from "discord.js";
import dateService from "../../utils/dateService.js";
import reflectiveAnalysisModalConfig from "./createReflectiveAnalysisModalConfig.js";
import reflectiveAnalysis from "../../database/models/reflectiveAnalysis.js";
import modalService from "../../utils/modalService.js";
import embedService from "../../utils/embedService.js";

/**
 * Feature command...
 */
export default {
  data: new SlashCommandBuilder()
    .setName("creer_analyse_reflexive")
    .setDescription("Créer une analyse reflexive"),
  allowedRoles: process.env.ADMIN_ROLE,
  async execute(interaction) {
    const latestReflectiveAnalysisRecord = await reflectiveAnalysis.findOne({
      limit: 1,
      order: [["createdAt", "DESC"]],
    });

    if (
      latestReflectiveAnalysisRecord &&
      latestReflectiveAnalysisRecord.status === "PROGRESS"
    ) {
      const reflectiveAnalysisInProgressEmbed = embedService.createEmbed(
        interaction.user,
        "Une analyse réflexive est en cours",
        `L'analyse réflexive '${
          latestReflectiveAnalysisRecord.dataValues.title
        }' se termine le ${dateService.formatAtTimeZone(
          latestReflectiveAnalysisRecord.dataValues.endAt
        )}`
      );

      await interaction.reply({
        embeds: [reflectiveAnalysisInProgressEmbed],
        fetchReply: true,
      });

      return;
    }

    const reflectiveAnalysisModal = modalService.createModal(
      reflectiveAnalysisModalConfig.name,
      reflectiveAnalysisModalConfig.title
    );

    const reflectiveAnalysisFields = modalService.createModalFields(
      reflectiveAnalysisModalConfig.fields
    );

    const reflectiveAnalysisActionRows = modalService.createActionRows(
      reflectiveAnalysisFields
    );

    reflectiveAnalysisModal.addComponents(...reflectiveAnalysisActionRows);

    await interaction.showModal(reflectiveAnalysisModal);
  },
};

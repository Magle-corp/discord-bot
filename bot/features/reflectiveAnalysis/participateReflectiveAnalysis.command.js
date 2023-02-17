import { SlashCommandBuilder, TextInputStyle } from "discord.js";
import dateService from "../../utils/dateService.js";
import reflectiveAnalysis from "../../database/models/reflectiveAnalysis.js";
import embedService from "../../utils/embedService.js";
import modalService from "../../utils/modalService.js";

/**
 * Feature command...
 */
export default {
  data: new SlashCommandBuilder()
    .setName("participer_analyse_reflexive")
    .setDescription("Participer à une analyse reflexive"),
  async execute(interaction) {
    const latestReflectiveAnalysisRecord = await reflectiveAnalysis.findOne({
      limit: 1,
      order: [["createdAt", "DESC"]],
    });

    if (!latestReflectiveAnalysisRecord) {
      const noReflectiveAnalysisEmbed = embedService.createEmbed(
        interaction.user,
        "Aucune analyse réflexive",
        "Aucune analyse réflexive enregistrée en base de données"
      );

      await interaction.reply({
        embeds: [noReflectiveAnalysisEmbed],
        fetchReply: true,
      });

      return;
    }

    if (
      latestReflectiveAnalysisRecord &&
      (latestReflectiveAnalysisRecord.status === "STOPPED" ||
        latestReflectiveAnalysisRecord.status === "ENDED")
    ) {
      const reflectiveAnalysisFinishedEmbed = embedService.createEmbed(
        interaction.user,
        "Aucune analyse réflexive en cours",
        `La dernière réflexive analyse c'est terminée le ${dateService.formatAtTimeZone(
          latestReflectiveAnalysisRecord.dataValues.endAt
        )}`
      );

      await interaction.reply({
        embeds: [reflectiveAnalysisFinishedEmbed],
        fetchReply: true,
      });

      return;
    }

    const reflectiveAnalysisModal = modalService.createModal(
      "participate_reflective_analysis",
      latestReflectiveAnalysisRecord.dataValues.title
    );

    const reflectiveAnalysisQuestions = modalService.getSpecificModalFields(
      latestReflectiveAnalysisRecord.dataValues,
      "question"
    );

    let reflectiveAnalysisModalFieldsConfig = [];

    Object.keys(reflectiveAnalysisQuestions).map((question, index) => {
      const fieldName = Object.values(reflectiveAnalysisQuestions)[index];
      if (fieldName) {
        reflectiveAnalysisModalFieldsConfig = [
          ...reflectiveAnalysisModalFieldsConfig,
          {
            name: `question_${index + 1}`,
            label: fieldName,
            style: TextInputStyle.Paragraph,
            maxLength: 300,
            minLength: 30,
            required: true,
          },
        ];
      }
    });

    const reflectiveAnalysisFields = modalService.createModalFields(
      reflectiveAnalysisModalFieldsConfig
    );

    const reflectiveAnalysisActionRows = modalService.createActionRows(
      reflectiveAnalysisFields
    );

    reflectiveAnalysisModal.addComponents(...reflectiveAnalysisActionRows);

    await interaction.showModal(reflectiveAnalysisModal);
  },
};

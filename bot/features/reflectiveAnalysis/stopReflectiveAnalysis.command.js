import { SlashCommandBuilder } from "discord.js";
import dateService from "../../utils/dateService.js";
import reflectiveAnalysis from "../../database/models/reflectiveAnalysis.js";
import embedService from "../../utils/embedService.js";

/**
 * Feature command...
 */
export default {
  data: new SlashCommandBuilder()
    .setName("arreter_analyse_reflexive")
    .setDescription("Arrêter une analyse reflexive"),
  allowedRoles: process.env.ADMIN_ROLE,
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

    await reflectiveAnalysis.update(
      { status: "STOPPED" },
      {
        where: {
          id: latestReflectiveAnalysisRecord.dataValues.id,
        },
      }
    );

    const reflectiveAnalysisStoppedEmbed = embedService.createEmbed(
      interaction.user,
      "Analyse réflexive arrêtée",
      `L'analyse réflexive '${latestReflectiveAnalysisRecord.dataValues.title}' a été arrêtée`
    );

    await interaction.reply({
      embeds: [reflectiveAnalysisStoppedEmbed],
      fetchReply: true,
    });
  },
};

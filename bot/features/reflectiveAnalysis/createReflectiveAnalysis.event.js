import { Events } from "discord.js";
import { addHours } from "date-fns";
import createReflectiveAnalysisModalConfig from "./createReflectiveAnalysisModalConfig.js";
import reflectiveAnalysis from "../../database/models/reflectiveAnalysis.js";
import modalService from "../../utils/modalService.js";
import embedService from "../../utils/embedService.js";
import dateService from "../../utils/dateService.js";

/**
 * Feature event...
 */
export default {
  name: Events.InteractionCreate,
  eventName: "creer_analyse_reflexive",
  once: false,
  async execute(client, interaction) {
    if (
      !interaction.isModalSubmit() ||
      interaction.customId !== createReflectiveAnalysisModalConfig.name
    )
      return;

    const reflectiveAnalysisModalFields = modalService.getModalInputFields(
      createReflectiveAnalysisModalConfig.fields,
      interaction
    );

    const reflectiveAnalysisEndTime = addHours(
      new Date(),
      reflectiveAnalysisModalFields.time
    );

    await reflectiveAnalysis.create({
      createdBy: interaction.user.username,
      title: reflectiveAnalysisModalFields.title,
      time: reflectiveAnalysisModalFields.time,
      questionOne: reflectiveAnalysisModalFields.questionOne,
      questionTwo: reflectiveAnalysisModalFields.questionTwo,
      questionThree: reflectiveAnalysisModalFields.questionThree,
      status: "PROGRESS",
      endAt: reflectiveAnalysisEndTime,
    });

    const reflectiveAnalysisQuestions = modalService.getSpecificModalFields(
      reflectiveAnalysisModalFields,
      "question"
    );

    const reflectiveAnalysisEmbedFields = embedService.createEmbedFields(
      reflectiveAnalysisQuestions
    );

    const reflectiveAnalysisEmbed = embedService.createEmbed(
      interaction.user,
      reflectiveAnalysisModalFields.title,
      `À réaliser avant le ${dateService.formatAtTimeZone(
        reflectiveAnalysisEndTime
      )}`
    );

    reflectiveAnalysisEmbed.addFields(...reflectiveAnalysisEmbedFields);

    await interaction.reply({
      embeds: [reflectiveAnalysisEmbed],
      fetchReply: true,
    });
  },
};

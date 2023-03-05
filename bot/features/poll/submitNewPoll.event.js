import { Events } from "discord.js";
import pollHelpers from "./helpers.js";
import pollModal from "./createPollModalConfig.js";
import embedService from "../../utils/embedService.js";

/**
 * Feature event.
 *
 * - create a poll embed based on the modal entries of the poll command.
 * - associate an emoji with each response for users to interact with the poll.
 * - collect interactions and create an embed with the results.
 */
export default {
  name: Events.InteractionCreate,
  eventName: "creer_un_sondage",
  once: false,
  async execute(client, interaction) {
    if (!interaction.isModalSubmit() || interaction.customId !== pollModal.name)
      return;

    // Get input values from a poll's creation modal.
    const modalAnswers = pollHelpers.getPollCreationModalInputValues(
      pollModal.fields,
      interaction
    );

    // Get poll possibilities and embed fields based on the poll's creation modal input values.
    const {
      pollReactionPossibilities,
      pollResponsePossibilities,
      pollEmbedFieldPossibilities,
    } = pollHelpers.getPollPossibilities(modalAnswers);

    // Create poll embed.
    const pollEmbed = embedService.createEmbed(
      interaction.user,
      modalAnswers.question.value,
      `Sondage ouvert ${modalAnswers.time.value} minute${
        modalAnswers.time.value > 1 ? "s" : ""
      }`
    );

    pollEmbed.addFields(...pollEmbedFieldPossibilities);

    // Post poll embed.
    const pollEmbedReply = await interaction.reply({
      embeds: [pollEmbed],
      fetchReply: true,
    });

    // Initialize the possible reactions for the poll.
    pollReactionPossibilities.forEach((reaction) =>
      pollEmbedReply.react(reaction)
    );

    // Reaction collector filter.
    const filter = (reaction, user) => {
      return (
        pollReactionPossibilities.includes(reaction.emoji.name) &&
        user.id !== pollEmbedReply.author.id
      );
    };

    // Reaction collector.
    const reactionCollector = pollEmbedReply.createReactionCollector({
      filter,
      time: parseInt(modalAnswers.time.value) * (1000 * 60),
    });

    reactionCollector.on("end", async (collected) => {
      // Create poll result embed.
      const resultEmbed = embedService.createEmbed(
        interaction.user,
        modalAnswers.question.value
      );

      // Case no one has voted.
      if (collected.map((reaction) => reaction).length === 0) {
        resultEmbed.addFields({
          name: " ",
          value: "Pas de votes",
        });

        await pollEmbedReply.reply({
          embeds: [resultEmbed],
          fetchReply: true,
        });

        return;
      }

      // Get poll result embed fields.
      const pollEmbedResultFields = pollHelpers.getPollResults(
        pollResponsePossibilities,
        collected
      );

      resultEmbed.addFields(...pollEmbedResultFields);

      await pollEmbedReply.reply({
        embeds: [resultEmbed],
        fetchReply: true,
      });
    });
  },
};

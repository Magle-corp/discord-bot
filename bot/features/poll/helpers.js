import { EmbedBuilder } from "discord.js";
import randomEmoji from "../../utils/getRandomEmoji.js";

const getPollCreationModalInputValues = (pollModalFields, interaction) => {
  let modalInputValues = {};

  pollModalFields.forEach((field) => {
    let inputValue = interaction.fields.getTextInputValue(field.name);
    const fieldAssociatedEmoji = randomEmoji();

    if (field.name === "time" && !/^\d+$/.test(inputValue)) {
      inputValue = "5";
    }

    modalInputValues = {
      ...modalInputValues,
      [field.name]: {
        value: inputValue,
        reaction: fieldAssociatedEmoji,
        formatted: fieldAssociatedEmoji + " - " + inputValue,
      },
    };
  });

  return modalInputValues;
};

const getPollPossibilities = (modalInputValues) => {
  let pollResponsePossibilities = [];
  let pollEmbedFieldPossibilities = [];
  let pollReactionPossibilities = [];

  Object.keys(modalInputValues).forEach((answer, index) => {
    if (answer.includes("response")) {
      const pollPossibilities = Object.values(modalInputValues)[index];

      if (pollPossibilities.value.length !== 0) {
        pollResponsePossibilities = [
          ...pollResponsePossibilities,
          pollPossibilities,
        ];

        pollEmbedFieldPossibilities = [
          ...pollEmbedFieldPossibilities,
          {
            name: " ",
            value: pollPossibilities.formatted,
          },
        ];

        // TODO: Handle case when emoji is already used by an other field.
        pollReactionPossibilities = [
          ...pollReactionPossibilities,
          pollPossibilities.reaction,
        ];
      }
    }
  });

  return {
    pollReactionPossibilities,
    pollResponsePossibilities,
    pollEmbedFieldPossibilities,
  };
};

const getPollResults = (pollResponsePossibilities, collected) => {
  let pollResults = [];
  let pollEmbedResultFields = [];

  pollResponsePossibilities.map((responsePossibility) => {
    const answerCollectedReaction = collected
      .filter((collectedReaction) => {
        return collectedReaction.emoji.name === responsePossibility.reaction;
      })
      .map((collectedReaction) => collectedReaction)[0];

    pollResults = [
      ...pollResults,
      {
        ...responsePossibility,
        votes: answerCollectedReaction ? answerCollectedReaction.count - 1 : 0,
      },
    ];
  });

  const orderedPollResults = pollResults.sort((possibilityA, possibilityB) =>
    possibilityA.votes > possibilityB.votes ? -1 : 1
  );

  orderedPollResults.map((pollResult) => {
    pollEmbedResultFields = [
      ...pollEmbedResultFields,
      {
        name: " ",
        value: `${pollResult.formatted} (${pollResult.votes})`,
      },
    ];
  });

  return pollEmbedResultFields;
};

export default {
  getPollCreationModalInputValues,
  getPollPossibilities,
  getPollResults,
};

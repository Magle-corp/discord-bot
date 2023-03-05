import { EmbedBuilder } from "discord.js";

const createEmbed = (user, title, description) => {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description && description.length > 0 ? description : " ")
    .setAuthor({ name: user.username, iconURL: user.avatarURL() });
};

const createEmbedFields = (embedFields) => {
  return Object.values(embedFields).map((field) => {
    return {
      name: " ",
      value: field,
    };
  });
};

export default {
  createEmbed,
  createEmbedFields,
};

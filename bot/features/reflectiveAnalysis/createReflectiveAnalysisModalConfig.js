import { TextInputStyle } from "discord.js";

export default {
  name: "create_reflective_analysis_modal",
  title: "Créer une analyse réflexive",
  fields: [
    {
      name: "title",
      label: "Titre de l'analyse réflexive",
      style: TextInputStyle.Short,
      maxLength: 45,
      required: true,
    },
    {
      name: "time",
      label: "Délai pour participer en heures",
      style: TextInputStyle.Short,
      maxLength: 2,
      default: "6",
      required: true,
    },
    {
      name: "questionOne",
      label: "Première question",
      style: TextInputStyle.Short,
      maxLength: 45,
      required: true,
    },
    {
      name: "questionTwo",
      label: "Seconde question",
      style: TextInputStyle.Short,
      maxLength: 45,
      required: false,
    },
    {
      name: "questionThree",
      label: "Troisième question",
      style: TextInputStyle.Short,
      maxLength: 45,
      required: false,
    },
  ],
};

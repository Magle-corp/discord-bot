import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from "discord.js";

const createModal = (name, title) => {
  return new ModalBuilder().setCustomId(name).setTitle(title);
};

const createModalFields = (modalFieldsConfig) => {
  return modalFieldsConfig.map((fieldConfig) => {
    const modalField = new TextInputBuilder()
      .setCustomId(fieldConfig.name)
      .setLabel(fieldConfig.label)
      .setStyle(fieldConfig.style)
      .setRequired(fieldConfig.required);

    if (fieldConfig.default) {
      modalField.setValue(fieldConfig.default);
    }

    if (fieldConfig.minLength) {
      modalField.setMinLength(fieldConfig.minLength);
    }

    if (fieldConfig.maxLength) {
      modalField.setMaxLength(fieldConfig.maxLength);
    }

    return modalField;
  });
};

const createActionRows = (modalFields) => {
  return modalFields.map((field) =>
    new ActionRowBuilder().addComponents(field)
  );
};

const getModalInputFields = (modalFieldsConfig, interaction) => {
  let modalInputFields = {};

  modalFieldsConfig.map((fieldConfig) => {
    let modalFieldValue = interaction.fields.getTextInputValue(
      fieldConfig.name
    );

    if (fieldConfig.name === "time" && !/^\d+$/.test(modalFieldValue)) {
      modalFieldValue = fieldConfig.default;
    }

    if (modalFieldValue.length > 0) {
      modalInputFields = {
        ...modalInputFields,
        [fieldConfig.name]: modalFieldValue,
      };
    }
  });

  return modalInputFields;
};

const getSpecificModalFields = (modalFields, keyWord) => {
  let specificModalFields = {};

  Object.keys(modalFields).map((fieldKey) => {
    if (fieldKey.includes(keyWord)) {
      specificModalFields = {
        ...specificModalFields,
        [fieldKey]: modalFields[fieldKey],
      };
    }
  });

  return specificModalFields;
};

export default {
  createModal,
  createModalFields,
  createActionRows,
  getModalInputFields,
  getSpecificModalFields,
};

const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("registro")
    .setDescription("Abre el formulario de registro para whitelist"),

  async execute(client, interaction) {
    const modal = new ModalBuilder()
      .setCustomId("modal_registro")
      .setTitle("Registro Whitelist DayZ");

    const gamertag = new TextInputBuilder()
      .setCustomId("gamertag")
      .setLabel("Gamertag de DayZ")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Ejemplo: Charly2190")
      .setRequired(true);

    const plataforma = new TextInputBuilder()
      .setCustomId("plataforma")
      .setLabel("Plataforma")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Xbox, PlayStation o PC")
      .setRequired(true);

    const edad = new TextInputBuilder()
      .setCustomId("edad")
      .setLabel("Edad")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Ejemplo: 18")
      .setRequired(true);

    const pais = new TextInputBuilder()
      .setCustomId("pais")
      .setLabel("País")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Ejemplo: México")
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(gamertag),
      new ActionRowBuilder().addComponents(plataforma),
      new ActionRowBuilder().addComponents(edad),
      new ActionRowBuilder().addComponents(pais)
    );

    await interaction.showModal(modal);
  }
};
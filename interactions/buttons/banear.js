const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = async function banear(client, interaction, discordId, player) {
  const modal = new ModalBuilder()
    .setCustomId(`modal_banear_${discordId}`)
    .setTitle("Banear jugador");

  const motivo = new TextInputBuilder()
    .setCustomId("motivo")
    .setLabel("Motivo del ban")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder("Ejemplo: Intento de evadir whitelist")
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder().addComponents(motivo)
  );

  await interaction.showModal(modal);
};
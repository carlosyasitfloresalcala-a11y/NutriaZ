const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = async function rechazar(client, interaction, discordId, player) {
  const modal = new ModalBuilder()
    .setCustomId(`modal_rechazar_${discordId}`)
    .setTitle("Rechazar solicitud");

  const motivo = new TextInputBuilder()
    .setCustomId("motivo")
    .setLabel("Motivo del rechazo")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder("Ejemplo: No cumple requisitos")
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder().addComponents(motivo)
  );

  await interaction.showModal(modal);
};
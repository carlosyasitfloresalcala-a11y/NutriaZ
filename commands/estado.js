const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { buscarJugador } = require("../utils/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("estado")
    .setDescription("Revisa el estado de un jugador")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option =>
      option.setName("usuario").setDescription("Jugador a revisar").setRequired(true)
    ),

  async execute(client, interaction) {
    const user = interaction.options.getUser("usuario");
    const player = await buscarJugador(user.id);

    if (!player) {
      return interaction.reply({
        content: "❌ Ese usuario no tiene registro.",
        ephemeral: true
      });
    }

    await interaction.reply({
      content:
        `📌 Estado de ${user}\n` +
        `🆔 Expediente: **${player.expediente || "Sin expediente"}**\n` +
        `🎮 Gamertag: **${player.gamertag}**\n` +
        `Estado: **${player.status}**\n` +
        `Advertencias: **${player.warnings || 0}**\n` +
        `Razón ban: **${player.banReason || "Ninguna"}**`,
      ephemeral: true
    });
  }
};
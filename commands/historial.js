const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { buscarJugador } = require("../utils/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("historial")
    .setDescription("Muestra el historial de un jugador")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Jugador a revisar")
        .setRequired(true)
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

    const historial = player.historial || [];

    const textoHistorial = historial.length === 0
      ? "No hay historial registrado."
      : historial
          .slice(-10)
          .map((h, i) => {
            const fecha = h.fecha
              ? new Date(h.fecha).toLocaleString("es-MX")
              : "Fecha no registrada";

            const staff = h.staffId ? `<@${h.staffId}>` : (h.staffTag || "Sistema");

            return `**${i + 1}. ${h.accion || "Acción"}**\n📅 ${fecha}\n👮 ${staff}\n📝 ${h.motivo || "Sin motivo"}`;
          })
          .join("\n\n");

    const embed = new EmbedBuilder()
      .setTitle(`📜 Historial — ${player.expediente || "Sin expediente"}`)
      .setColor(0x9b59b6)
      .addFields(
        { name: "👤 Discord", value: `${user}`, inline: true },
        { name: "🎮 Gamertag", value: `**${player.gamertag || "No registrado"}**`, inline: true },
        { name: "📌 Estado", value: `**${player.estado || "Sin estado"}**`, inline: true },
        { name: "📜 Últimos movimientos", value: textoHistorial }
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};
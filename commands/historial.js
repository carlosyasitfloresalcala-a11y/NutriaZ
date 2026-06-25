const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { buscarJugador } = require("../utils/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("historial")
    .setDescription("Muestra el historial de un jugador")
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

    const historial = player.historial || [];

    const textoHistorial = historial.length === 0
      ? "No hay historial registrado."
      : historial.slice(-10).map((h, i) => {
          const fecha = new Date(h.fecha).toLocaleString("es-MX");
          const admin = h.adminId ? `<@${h.adminId}>` : "Sistema";
          return `**${i + 1}. ${h.accion}**\n📅 ${fecha}\n👮 ${admin}\n📝 ${h.detalle}`;
        }).join("\n\n");

    const embed = new EmbedBuilder()
      .setTitle(`📜 Historial — ${player.expediente || "Sin expediente"}`)
      .setColor(0x9b59b6)
      .addFields(
        { name: "👤 Discord", value: `${user}`, inline: true },
        { name: "🎮 Gamertag", value: `**${player.gamertag}**`, inline: true },
        { name: "📌 Estado", value: `**${player.status}**`, inline: true },
        { name: "📜 Últimos movimientos", value: textoHistorial }
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};
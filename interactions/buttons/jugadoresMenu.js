const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { leerDB } = require("../../utils/database");

module.exports = async function jugadoresMenu(client, interaction) {
  const db = await leerDB();
  const players = db.players || [];

  const embed = new EmbedBuilder()
    .setTitle("👥 Módulo Jugadores")
    .setColor(0x3498db)
    .setDescription("Consulta jugadores registrados por estado.")
    .addFields(
      { name: "👥 Total", value: `${players.length}`, inline: true },
      { name: "🟢 Aprobados", value: `${players.filter(p => p.status === "aprobado").length}`, inline: true },
      { name: "🟡 Pendientes", value: `${players.filter(p => p.status === "pendiente").length}`, inline: true },
      { name: "🔴 Rechazados", value: `${players.filter(p => p.status === "rechazado").length}`, inline: true },
      { name: "⚫ Baneados", value: `${players.filter(p => p.status === "baneado").length}`, inline: true },
      { name: "🗄️ Base de datos", value: "MongoDB 🟢", inline: true }
    )
    .setTimestamp();

  const fila1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("panel_lista").setLabel("Aprobados").setEmoji("🟢").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("panel_pendientes").setLabel("Pendientes").setEmoji("🟡").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("panel_baneados").setLabel("Baneados").setEmoji("⚫").setStyle(ButtonStyle.Danger)
  );

  const fila2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("dash_home").setLabel("Volver").setEmoji("↩️").setStyle(ButtonStyle.Secondary)
  );

  return interaction.update({
    embeds: [embed],
    components: [fila1, fila2]
  });
};
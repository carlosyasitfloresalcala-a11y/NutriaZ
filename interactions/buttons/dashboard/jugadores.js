const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { leerDB } = require("../../utils/database");

module.exports = async function jugadoresMenu(client, interaction) {
  const db = await leerDB();
  const players = db.players || [];

  const total = players.length;
  const aprobados = players.filter(p => p.estado === "Aprobado").length;
  const pendientes = players.filter(p => p.estado === "Pendiente").length;
  const rechazados = players.filter(p => p.estado === "Rechazado").length;
  const baneados = players.filter(p => p.estado === "Baneado").length;

  const embed = new EmbedBuilder()
    .setTitle("👥 Módulo Jugadores")
    .setColor(0x3498db)
    .setDescription("Consulta jugadores registrados por estado.")
    .addFields(
      { name: "👥 Total", value: `${total}`, inline: true },
      { name: "🟢 Aprobados", value: `${aprobados}`, inline: true },
      { name: "🟡 Pendientes", value: `${pendientes}`, inline: true },
      { name: "🔴 Rechazados", value: `${rechazados}`, inline: true },
      { name: "⚫ Baneados", value: `${baneados}`, inline: true },
      { name: "🗄️ Base de datos", value: "MongoDB 🟢", inline: true }
    )
    .setFooter({ text: "NutriaZ • Jugadores" })
    .setTimestamp();

  const fila1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("panel_lista")
      .setLabel("Aprobados")
      .setEmoji("🟢")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("panel_pendientes")
      .setLabel("Pendientes")
      .setEmoji("🟡")
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId("panel_baneados")
      .setLabel("Baneados")
      .setEmoji("⚫")
      .setStyle(ButtonStyle.Danger)
  );

  const fila2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("dash_home")
      .setLabel("Volver")
      .setEmoji("↩️")
      .setStyle(ButtonStyle.Secondary)
  );

  return interaction.update({
    embeds: [embed],
    components: [fila1, fila2]
  });
};
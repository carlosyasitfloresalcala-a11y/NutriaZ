const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { leerDB } = require("../../utils/database");

module.exports = async function dashboard(client, interaction) {
  const db = await leerDB();
  const players = db.players || [];

  const total = players.length;
  const aprobados = players.filter(p => p.estado === "Aprobado").length;
  const pendientes = players.filter(p => p.estado === "Pendiente").length;
  const rechazados = players.filter(p => p.estado === "Rechazado").length;
  const baneados = players.filter(p => p.estado === "Baneado").length;

  const embed = new EmbedBuilder()
    .setTitle("🦦 NutriaZ — Dashboard")
    .setColor(0x2ecc71)
    .setDescription("Panel principal de administración de whitelist.")
    .addFields(
      { name: "👥 Registrados", value: `${total}`, inline: true },
      { name: "🟢 Aprobados", value: `${aprobados}`, inline: true },
      { name: "🟡 Pendientes", value: `${pendientes}`, inline: true },
      { name: "🔴 Rechazados", value: `${rechazados}`, inline: true },
      { name: "⚫ Baneados", value: `${baneados}`, inline: true },
      { name: "🗄️ Base de datos", value: "MongoDB 🟢", inline: true }
    )
    .setFooter({ text: "NutriaZ • Sistema Whitelist DayZ" })
    .setTimestamp();

  const fila1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("dash_whitelist")
      .setLabel("Whitelist")
      .setEmoji("📋")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("dash_jugadores")
      .setLabel("Jugadores")
      .setEmoji("👥")
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId("dash_home")
      .setLabel("Actualizar")
      .setEmoji("🔄")
      .setStyle(ButtonStyle.Secondary)
  );

  const fila2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("panel_exportar")
      .setLabel("Exportar")
      .setEmoji("📁")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("panel_estadisticas")
      .setLabel("Estadísticas")
      .setEmoji("📊")
      .setStyle(ButtonStyle.Primary)
  );

  return interaction.update({
    embeds: [embed],
    components: [fila1, fila2]
  }).catch(() => {
    return interaction.reply({
      embeds: [embed],
      components: [fila1, fila2],
      ephemeral: true
    });
  });
};
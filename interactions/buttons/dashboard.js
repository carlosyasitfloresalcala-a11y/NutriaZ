const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { leerDB } = require("../../utils/database");

module.exports = async function dashboard(client, interaction) {
  const db = await leerDB();
  const players = db.players || [];

  const total = players.length;
  const aprobados = players.filter(p => p.status === "aprobado").length;
  const pendientes = players.filter(p => p.status === "pendiente").length;
  const rechazados = players.filter(p => p.status === "rechazado").length;
  const baneados = players.filter(p => p.status === "baneado").length;

  const embed = new EmbedBuilder()
    .setTitle("🦦 Nutria Bot — Dashboard")
    .setColor(0x2ecc71)
    .setDescription("Panel principal de administración del servidor DayZ.")
    .addFields(
      { name: "👥 Registrados", value: `${total}`, inline: true },
      { name: "🟢 Aprobados", value: `${aprobados}`, inline: true },
      { name: "🟡 Pendientes", value: `${pendientes}`, inline: true },
      { name: "🔴 Rechazados", value: `${rechazados}`, inline: true },
      { name: "⚫ Baneados", value: `${baneados}`, inline: true },
      { name: "🗄️ Base de datos", value: "MongoDB 🟢", inline: true }
    )
    .setFooter({ text: "Nutria Bot • Sistema DayZ" })
    .setTimestamp();

  const fila1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("dash_whitelist").setLabel("Whitelist").setEmoji("📋").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("dash_jugadores").setLabel("Jugadores").setEmoji("👥").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("dash_historial").setLabel("Historial").setEmoji("📜").setStyle(ButtonStyle.Secondary)
  );

  const fila2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("dash_exportar").setLabel("Exportar").setEmoji("📁").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("dash_stats").setLabel("Estadísticas").setEmoji("📊").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("dash_config").setLabel("Config").setEmoji("⚙️").setStyle(ButtonStyle.Secondary)
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
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const { leerDB } = require("../utils/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("panel")
    .setDescription("Abre el panel principal del bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(client, interaction) {
    const db = await leerDB();
    const players = db.players || [];

    const total = players.length;
    const aprobados = players.filter(p => p.status === "aprobado").length;
    const pendientes = players.filter(p => p.status === "pendiente").length;
    const rechazados = players.filter(p => p.status === "rechazado").length;
    const baneados = players.filter(p => p.status === "baneado").length;

    const embed = new EmbedBuilder()
      .setTitle("🦦 Panel Principal — Nutria Whitelist")
      .setColor(0x3498db)
      .setDescription("Administra tu servidor de DayZ desde este panel.")
      .addFields(
        { name: "👥 Registrados", value: `${total}`, inline: true },
        { name: "🟢 Aprobados", value: `${aprobados}`, inline: true },
        { name: "🟡 Pendientes", value: `${pendientes}`, inline: true },
        { name: "🔴 Rechazados", value: `${rechazados}`, inline: true },
        { name: "⚫ Baneados", value: `${baneados}`, inline: true }
      )
      .setFooter({ text: "Nutria Whitelist • Sistema Administrativo" })
      .setTimestamp();

    const botones1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("panel_lista").setLabel("Lista").setEmoji("👥").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("panel_pendientes").setLabel("Pendientes").setEmoji("🟡").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("panel_exportar").setLabel("Exportar").setEmoji("📁").setStyle(ButtonStyle.Success)
    );

    const botones2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("panel_baneados").setLabel("Baneados").setEmoji("⚫").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId("panel_estadisticas").setLabel("Estadísticas").setEmoji("📊").setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      embeds: [embed],
      components: [botones1, botones2],
      ephemeral: true
    });
  }
};
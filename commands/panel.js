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
    const aprobados = players.filter(p => p.estado === "Aprobado").length;
    const pendientes = players.filter(p => p.estado === "Pendiente").length;
    const rechazados = players.filter(p => p.estado === "Rechazado").length;
    const baneados = players.filter(p => p.estado === "Baneado").length;

    const embed = new EmbedBuilder()
      .setTitle("🦦 Panel Principal — NutriaZ")
      .setColor(0x3498db)
      .setDescription("Administra la whitelist del servidor DayZ desde este panel.")
      .addFields(
        { name: "👥 Registrados", value: `${total}`, inline: true },
        { name: "🟢 Aprobados", value: `${aprobados}`, inline: true },
        { name: "🟡 Pendientes", value: `${pendientes}`, inline: true },
        { name: "🔴 Rechazados", value: `${rechazados}`, inline: true },
        { name: "⚫ Baneados", value: `${baneados}`, inline: true }
      )
      .setFooter({ text: "NutriaZ • Sistema Whitelist DayZ" })
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
        .setCustomId("panel_exportar")
        .setLabel("Exportar")
        .setEmoji("📁")
        .setStyle(ButtonStyle.Primary)
    );

    const fila2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("panel_baneados")
        .setLabel("Baneados")
        .setEmoji("⚫")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("panel_estadisticas")
        .setLabel("Estadísticas")
        .setEmoji("📊")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      embeds: [embed],
      components: [fila1, fila2],
      ephemeral: true
    });
  }
};
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { leerDB } = require("../utils/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buscar")
    .setDescription("Busca un jugador por expediente, gamertag o Discord")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
      option
        .setName("texto")
        .setDescription("Ejemplo: WL-000001, Charly2190 o Juan")
        .setRequired(true)
    ),

  async execute(client, interaction) {
    const texto = interaction.options.getString("texto").toLowerCase();
    const db = await leerDB();
    const players = db.players || [];

    const resultados = players.filter(p =>
      (p.expediente || "").toLowerCase().includes(texto) ||
      (p.gamertag || "").toLowerCase().includes(texto) ||
      (p.discordTag || "").toLowerCase().includes(texto) ||
      (p.discordId || "").includes(texto)
    );

    if (resultados.length === 0) {
      return interaction.reply({
        content: "❌ No encontré ningún jugador con esa búsqueda.",
        ephemeral: true
      });
    }

    const textoResultados = resultados.slice(0, 10).map((p, i) =>
      `**${i + 1}. ${p.expediente || "Sin expediente"}**\n` +
      `👤 Discord: <@${p.discordId}>\n` +
      `🎮 Gamertag: **${p.gamertag || "No registrado"}**\n` +
      `📌 Estado: **${p.estado || "Sin estado"}**`
    ).join("\n\n");

    const embed = new EmbedBuilder()
      .setTitle("🔍 Resultados de búsqueda")
      .setColor(0x3498db)
      .setDescription(textoResultados)
      .setFooter({ text: `Resultados: ${resultados.length}` })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};
const { SlashCommandBuilder, PermissionFlagsBits, AttachmentBuilder } = require("discord.js");
const { leerDB } = require("../utils/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("exportar")
    .setDescription("Exporta la whitelist en archivo .txt")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(client, interaction) {
    const db = await leerDB();
    const aprobados = (db.players || []).filter(p => p.status === "aprobado");

    const contenido = aprobados.length === 0
      ? "No hay jugadores aprobados."
      : aprobados.map(p => p.gamertag).join("\n");

    const archivo = new AttachmentBuilder(
      Buffer.from(contenido, "utf8"),
      { name: "whitelist.txt" }
    );

    await interaction.reply({
      content: `📁 Whitelist exportada.\nJugadores aprobados: **${aprobados.length}**`,
      files: [archivo],
      ephemeral: true
    });
  }
};
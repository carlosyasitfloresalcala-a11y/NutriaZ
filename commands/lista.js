const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { leerDB } = require("../utils/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lista")
    .setDescription("Muestra los jugadores aprobados")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(client, interaction) {
    const db = await leerDB();
    const players = (db.players || []).filter(p => p.estado === "Aprobado");

    if (players.length === 0) {
      return interaction.reply({
        content: "No hay jugadores aprobados todavía.",
        ephemeral: true
      });
    }

    const texto = players
      .map((p, i) =>
        `${i + 1}. **${p.expediente || "Sin expediente"}** — **${p.gamertag}** — <@${p.discordId}>`
      )
      .join("\n");

    await interaction.reply({
      content: `🟢 **Jugadores aprobados:**\n\n${texto}`,
      ephemeral: true
    });
  }
};
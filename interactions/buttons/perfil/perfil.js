const { EmbedBuilder } = require("discord.js");
const { buscarJugador } = require("../../../utils/database");

module.exports = async function perfilBotones(client, interaction) {
  const partes = interaction.customId.split("_");
  const accion = partes[1];
  const discordId = partes[2];

  const player = await buscarJugador(discordId);

  if (!player) {
    return interaction.reply({
      content: "❌ No encontré el expediente.",
      ephemeral: true
    });
  }

  if (accion === "historial") {
    const historial = player.historial || [];

    const texto = historial.length === 0
      ? "No hay historial registrado."
      : historial.slice(-10).map((h, i) => {
          const fecha = h.fecha ? new Date(h.fecha).toLocaleString("es-MX") : "Sin fecha";
          const staff = h.staffId ? `<@${h.staffId}>` : h.staffTag || "Sistema";

          return `**${i + 1}. ${h.accion}**\n📅 ${fecha}\n👮 ${staff}\n📝 ${h.motivo || "Sin motivo"}`;
        }).join("\n\n");

    const embed = new EmbedBuilder()
      .setTitle(`📜 Historial — ${player.expediente}`)
      .setColor(0x9b59b6)
      .setDescription(texto)
      .setTimestamp();

    return interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }

  if (accion === "warn") {
    return interaction.reply({
      content: "⚠️ El sistema de advertencias será el siguiente módulo.",
      ephemeral: true
    });
  }

  if (accion === "nota") {
    return interaction.reply({
      content: "📝 El sistema de notas será el siguiente módulo.",
      ephemeral: true
    });
  }

  if (accion === "ban") {
    return interaction.reply({
      content: "🔨 Para banear desde el perfil, lo conectaremos en el siguiente paso.",
      ephemeral: true
    });
  }
};
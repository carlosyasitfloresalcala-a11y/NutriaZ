const { AttachmentBuilder } = require("discord.js");
const { leerDB } = require("../../utils/database");

module.exports = async function panelBotones(client, interaction) {
  const db = await leerDB();
  const players = db.players || [];
  const accion = interaction.customId;

  if (accion === "panel_lista") {
    const aprobados = players.filter(p => p.status === "aprobado");

    if (aprobados.length === 0) {
      return interaction.reply({ content: "No hay jugadores aprobados.", ephemeral: true });
    }

    const texto = aprobados
      .map((p, i) => `${i + 1}. **${p.expediente || "Sin expediente"}** — **${p.gamertag}** — <@${p.discordId}>`)
      .join("\n");

    return interaction.reply({
      content: `👥 **Jugadores aprobados:**\n\n${texto}`,
      ephemeral: true
    });
  }

  if (accion === "panel_pendientes") {
    const pendientes = players.filter(p => p.status === "pendiente");

    if (pendientes.length === 0) {
      return interaction.reply({ content: "No hay solicitudes pendientes.", ephemeral: true });
    }

    const texto = pendientes
      .map((p, i) => `${i + 1}. **${p.expediente || "Sin expediente"}** — **${p.gamertag}** — <@${p.discordId}>`)
      .join("\n");

    return interaction.reply({
      content: `🟡 **Solicitudes pendientes:**\n\n${texto}`,
      ephemeral: true
    });
  }

  if (accion === "panel_baneados") {
    const baneados = players.filter(p => p.status === "baneado");

    if (baneados.length === 0) {
      return interaction.reply({ content: "No hay jugadores baneados.", ephemeral: true });
    }

    const texto = baneados
      .map((p, i) =>
        `${i + 1}. **${p.expediente || "Sin expediente"}** — **${p.gamertag}** — <@${p.discordId}>\nMotivo: ${p.banReason || "No registrado"}`
      )
      .join("\n\n");

    return interaction.reply({
      content: `⚫ **Jugadores baneados:**\n\n${texto}`,
      ephemeral: true
    });
  }

  if (accion === "panel_estadisticas") {
    const total = players.length;
    const aprobados = players.filter(p => p.status === "aprobado").length;
    const pendientes = players.filter(p => p.status === "pendiente").length;
    const rechazados = players.filter(p => p.status === "rechazado").length;
    const baneados = players.filter(p => p.status === "baneado").length;

    return interaction.reply({
      content:
        `📊 **Estadísticas**\n\n` +
        `👥 Registrados: **${total}**\n` +
        `🟢 Aprobados: **${aprobados}**\n` +
        `🟡 Pendientes: **${pendientes}**\n` +
        `🔴 Rechazados: **${rechazados}**\n` +
        `⚫ Baneados: **${baneados}**`,
      ephemeral: true
    });
  }

  if (accion === "panel_exportar") {
    const aprobados = players.filter(p => p.status === "aprobado");
    const contenido = aprobados.map(p => p.gamertag).join("\n");

    const archivo = new AttachmentBuilder(
      Buffer.from(contenido || "No hay jugadores aprobados.", "utf8"),
      { name: "whitelist.txt" }
    );

    return interaction.reply({
      content: "📁 Aquí está tu archivo de whitelist.",
      files: [archivo],
      ephemeral: true
    });
  }
};
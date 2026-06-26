const { guardarJugador, buscarJugador, agregarHistorial } = require("../../../utils/database")

module.exports = async function banModal(client, interaction) {
  const discordId = interaction.customId.replace("modal_banear_", "");
  const motivo = interaction.fields.getTextInputValue("motivo");

  const player = await buscarJugador(discordId);

  if (!player) {
    return interaction.reply({
      content: "❌ No encontré el registro.",
      ephemeral: true
    });
  }

  const actualizado = await guardarJugador({
    ...player,
    estado: "Baneado",
    banReason: motivo,
    ultimoCambio: new Date()
  });

  await agregarHistorial(
    discordId,
    "BANEADO",
    motivo,
    interaction.user.id,
    interaction.user.tag
  );

  const user = await client.users.fetch(discordId).catch(() => null);
  const member = await interaction.guild.members.fetch(discordId).catch(() => null);

  if (member) {
    await member.ban({
      reason: motivo
    }).catch(() => {});
  }

  await interaction.reply({
    content:
      `⚫ Jugador baneado correctamente.\n` +
      `🆔 Expediente: **${actualizado.expediente}**`,
    ephemeral: true
  });

  if (user) {
    await user.send(
      `⛔ Has sido baneado de la whitelist.\n\n` +
      `🆔 Expediente: **${actualizado.expediente}**\n` +
      `🎮 Gamertag: **${actualizado.gamertag}**\n` +
      `📌 Motivo: **${motivo}**`
    ).catch(() => {});
  }
};
const { guardarJugador, buscarJugador, agregarHistorial } = require("../../../utils/database")

module.exports = async function rechazoModal(client, interaction) {
  const discordId = interaction.customId.replace("modal_rechazar_", "");
  const motivo = interaction.fields.getTextInputValue("motivo");

  const player = await buscarJugador(discordId);

  if (!player) {
    return interaction.reply({
      content: "❌ No encontré el registro de este jugador.",
      ephemeral: true
    });
  }

  const actualizado = await guardarJugador({
    ...player,
    estado: "Rechazado",
    ultimoCambio: new Date(),
    rejectReason: motivo
  });

  await agregarHistorial(
    discordId,
    "RECHAZADO",
    motivo,
    interaction.user.id,
    interaction.user.tag
  );

  const user = await client.users.fetch(discordId).catch(() => null);

  await interaction.reply({
    content: `🔴 Solicitud rechazada correctamente.\n🆔 Expediente: **${actualizado.expediente}**`,
    ephemeral: true
  });

  if (user) {
    await user.send(
      `🔴 Tu solicitud fue rechazada.\n🆔 Expediente: **${actualizado.expediente}**\n🎮 Gamertag: **${actualizado.gamertag}**\n📌 Motivo: **${motivo}**`
    ).catch(() => {});
  }
};
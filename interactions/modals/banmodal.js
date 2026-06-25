const { guardarJugador, buscarJugador, agregarHistorial } = require("../../utils/database");

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
    status: "baneado",
    banReason: motivo,
    bannedBy: interaction.user.id,
    bannedAt: new Date().toISOString()
  });

  await agregarHistorial(discordId, "BANEADO", motivo, interaction.user.id);

  const user = await client.users.fetch(discordId).catch(() => null);
  const member = await interaction.guild.members.fetch(discordId).catch(() => null);

  if (member) {
    await member.ban({ reason: motivo }).catch(() => {});
  }

  await interaction.reply({
    content: `⚫ Jugador baneado correctamente.\n🆔 Expediente: **${actualizado.expediente}**`,
    ephemeral: true
  });

  if (user) {
    await user.send(
      `⛔ Has sido baneado.\n🆔 Expediente: **${actualizado.expediente}**\n📌 Motivo: **${motivo}**`
    ).catch(() => {});
  }
};
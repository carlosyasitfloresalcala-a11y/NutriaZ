const config = require("../../config");
const { guardarJugador, agregarHistorial } = require("../../utils/database");
const { estadoEmbed } = require("../../utils/embeds");

module.exports = async function aprobar(client, interaction, discordId, player) {
  const user = await client.users.fetch(discordId).catch(() => null);
  const member = await interaction.guild.members.fetch(discordId).catch(() => null);

  const actualizado = await guardarJugador({
    ...player,
    estado: "Aprobado",
    aprobadoPor: interaction.user.id,
    fechaAprobacion: new Date()
  });

  await agregarHistorial(
    discordId,
    "APROBADO",
    "Solicitud aprobada",
    interaction.user.id,
    interaction.user.tag
  );

  if (member && config.whitelistRoleId) {
    await member.roles.add(config.whitelistRoleId).catch(() => {});
  }

  await interaction.update({
    embeds: [
      estadoEmbed(
        "✅ Solicitud aprobada",
        user ? `${user}` : `<@${discordId}>`,
        actualizado,
        "🟢 Aprobado",
        0x2ecc71
      )
    ],
    components: []
  });

  if (user) {
    await user.send(
      `✅ Fuiste aprobado en la whitelist.\n🆔 Expediente: **${actualizado.expediente}**\n🎮 Gamertag: **${actualizado.gamertag}**`
    ).catch(() => {});
  }
};
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const config = require("../../config");
const { guardarJugador, buscarJugador, agregarHistorial } = require("../../utils/database");
const { solicitudEmbed } = require("../../utils/embeds");

module.exports = async function registroModal(client, interaction) {
  const existente = await buscarJugador(interaction.user.id);

  if (existente && existente.status === "aprobado") {
    return interaction.reply({
      content: `❌ Ya estás aprobado.\n🆔 Expediente: **${existente.expediente}**`,
      ephemeral: true
    });
  }

  if (existente && existente.status === "baneado") {
    return interaction.reply({
      content: `⛔ Estás baneado de la whitelist.\nMotivo: **${existente.banReason || "No registrado"}**`,
      ephemeral: true
    });
  }

  const gamertag = interaction.fields.getTextInputValue("gamertag");
  const plataforma = interaction.fields.getTextInputValue("plataforma");
  const edad = interaction.fields.getTextInputValue("edad");
  const pais = interaction.fields.getTextInputValue("pais");

  const player = await guardarJugador({
    discordId: interaction.user.id,
    username: interaction.user.tag,
    gamertag,
    plataforma,
    edad,
    pais,
    status: "pendiente",
    warnings: existente?.warnings || 0,
    banReason: "",
    createdAt: existente?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    expediente: existente?.expediente
  });

  await agregarHistorial(
    interaction.user.id,
    "REGISTRO",
    `Registro enviado con gamertag ${gamertag}`,
    null
  );

  await interaction.reply({
    content:
      `✅ Tu solicitud fue enviada correctamente.\n\n` +
      `🆔 **Expediente:** ${player.expediente}\n` +
      `🎮 **Gamertag:** ${gamertag}\n` +
      `🕹️ **Plataforma:** ${plataforma}\n` +
      `🎂 **Edad:** ${edad}\n` +
      `🌎 **País:** ${pais}\n\n` +
      `Ahora un administrador revisará tu solicitud.`,
    ephemeral: true
  });

  const canal = await interaction.guild.channels
    .fetch(config.logChannelId)
    .catch(() => null);

  if (!canal) return;

  const botones = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`aprobar_${interaction.user.id}`)
      .setLabel("Aprobar")
      .setEmoji("🟢")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId(`rechazar_${interaction.user.id}`)
      .setLabel("Rechazar")
      .setEmoji("🔴")
      .setStyle(ButtonStyle.Danger),

    new ButtonBuilder()
      .setCustomId(`banear_${interaction.user.id}`)
      .setLabel("Banear")
      .setEmoji("⚫")
      .setStyle(ButtonStyle.Secondary)
  );

  await canal.send({
    embeds: [solicitudEmbed(interaction.user, player)],
    components: [botones]
  });
};
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const { buscarJugador } = require("../utils/database");

function formatearFecha(fecha) {
  if (!fecha) return "No registrada";

  return new Date(fecha).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("perfil")
    .setDescription("Muestra el expediente completo de un jugador")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Jugador a revisar")
        .setRequired(true)
    ),

  async execute(client, interaction) {
    const user = interaction.options.getUser("usuario");
    const player = await buscarJugador(user.id);

    if (!player) {
      return interaction.reply({
        content: "❌ Ese usuario no tiene expediente registrado.",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(`🦦 Expediente — ${player.expediente || "Sin expediente"}`)
      .setColor(0x2ecc71)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "👤 Discord", value: `${user}`, inline: true },
        { name: "🎮 Gamertag", value: `**${player.gamertag || "No registrado"}**`, inline: true },
        { name: "📌 Estado", value: `**${player.estado || "Sin estado"}**`, inline: true },
        { name: "🌎 País", value: `**${player.pais || "No registrado"}**`, inline: true },
        { name: "🎂 Edad", value: `**${player.edad || "No registrada"}**`, inline: true },
        { name: "🎯 Plataforma/Experiencia", value: `**${player.experiencia || "No registrada"}**`, inline: true },
        { name: "📅 Registro", value: formatearFecha(player.fechaRegistro), inline: true },
        { name: "📅 Aprobación", value: formatearFecha(player.fechaAprobacion), inline: true },
        { name: "👮 Aprobado por", value: player.aprobadoPor ? `<@${player.aprobadoPor}>` : "No registrado", inline: true },
        { name: "⚠️ Advertencias", value: `${player.advertencias?.length || 0}`, inline: true },
        { name: "📝 Notas Staff", value: `${player.notas?.length || 0}`, inline: true },
        { name: "📜 Historial", value: `${player.historial?.length || 0} movimientos`, inline: true }
      )
      .setFooter({ text: "NutriaZ • Expediente del jugador" })
      .setTimestamp();

    const botones = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`perfil_historial_${user.id}`)
        .setLabel("Historial")
        .setEmoji("📜")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId(`perfil_warn_${user.id}`)
        .setLabel("Advertir")
        .setEmoji("⚠️")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId(`perfil_nota_${user.id}`)
        .setLabel("Nota")
        .setEmoji("📝")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId(`perfil_ban_${user.id}`)
        .setLabel("Banear")
        .setEmoji("🔨")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({
      embeds: [embed],
      components: [botones],
      ephemeral: true
    });
  }
};
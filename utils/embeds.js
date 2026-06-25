const { EmbedBuilder } = require("discord.js");

function solicitudEmbed(user, player) {
  return new EmbedBuilder()
    .setTitle(`📋 Nueva solicitud — ${player.expediente || "Sin expediente"}`)
    .setColor(0xf1c40f)
    .addFields(
      { name: "🆔 Expediente", value: `**${player.expediente || "Pendiente"}**`, inline: true },
      { name: "👤 Discord", value: `${user}`, inline: true },
      { name: "🎮 Gamertag", value: `**${player.gamertag}**`, inline: true },
      { name: "🕹️ Plataforma", value: `**${player.plataforma}**`, inline: true },
      { name: "🎂 Edad", value: `**${player.edad}**`, inline: true },
      { name: "🌎 País", value: `**${player.pais}**`, inline: true },
      { name: "📌 Estado", value: "🟡 Pendiente", inline: false }
    )
    .setFooter({ text: `Discord ID: ${user.id}` })
    .setTimestamp();
}

function estadoEmbed(titulo, userText, player, estado, color) {
  return new EmbedBuilder()
    .setTitle(`${titulo} — ${player.expediente || "Sin expediente"}`)
    .setColor(color)
    .addFields(
      { name: "🆔 Expediente", value: `**${player.expediente || "No registrado"}**`, inline: true },
      { name: "👤 Discord", value: userText, inline: true },
      { name: "🎮 Gamertag", value: `**${player.gamertag}**`, inline: true },
      { name: "🕹️ Plataforma", value: `**${player.plataforma || "No registrada"}**`, inline: true },
      { name: "🎂 Edad", value: `**${player.edad || "No registrada"}**`, inline: true },
      { name: "🌎 País", value: `**${player.pais || "No registrado"}**`, inline: true },
      { name: "📌 Estado", value: estado, inline: false }
    )
    .setTimestamp();
}

module.exports = {
  solicitudEmbed,
  estadoEmbed
};
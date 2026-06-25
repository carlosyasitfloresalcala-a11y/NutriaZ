const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Muestra la configuración actual del bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(client, interaction) {
    const embed = new EmbedBuilder()
      .setTitle("⚙️ Configuración del Bot")
      .setColor(0x95a5a6)
      .addFields(
        { name: "📜 Canal de logs", value: config.logChannelId ? `<#${config.logChannelId}>` : "No configurado", inline: false },
        { name: "✅ Rol Whitelist", value: config.whitelistRoleId ? `<@&${config.whitelistRoleId}>` : "No configurado", inline: false },
        { name: "👑 Rol Admin", value: config.adminRoleId ? `<@&${config.adminRoleId}>` : "No configurado", inline: false },
        { name: "🏠 Servidor", value: config.guildId || "No configurado", inline: false }
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};
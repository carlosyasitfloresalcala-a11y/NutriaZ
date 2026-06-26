const { esAdmin } = require("../utils/permisos");
const { buscarJugador } = require("../utils/database");

const registroModal = require("../interactions/modals/whitelist/registro");
const rechazoModal = require("../interactions/modals/whitelist/rechazo");
const banModal = require("../interactions/modals/whitelist/ban");

const perfilBotones = require("../interactions/buttons/perfil/perfil");

module.exports = async (client, interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      if (interaction.commandName !== "registro" && !esAdmin(interaction.member)) {
        return interaction.reply({
          content: "❌ Solo administradores.",
          ephemeral: true
        });
      }

      return command.execute(client, interaction);
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === "modal_registro") {
        return registroModal(client, interaction);
      }

      if (interaction.customId.startsWith("modal_rechazar_")) {
        return rechazoModal(client, interaction);
      }

      if (interaction.customId.startsWith("modal_banear_")) {
        return banModal(client, interaction);
      }

      return;
    }

    if (interaction.isButton()) {
      if (!esAdmin(interaction.member)) {
        return interaction.reply({
          content: "❌ Solo administradores.",
          ephemeral: true
        });
      }

      if (interaction.customId.startsWith("perfil_")) {
        return perfilBotones(client, interaction);
      }

      if (interaction.customId === "dash_home") {
        return client.buttons.get("home")(client, interaction);
      }

      if (interaction.customId === "dash_whitelist") {
        return client.buttons.get("whitelist")(client, interaction);
      }

      if (interaction.customId === "dash_jugadores") {
        return client.buttons.get("jugadores")(client, interaction);
      }

      if (interaction.customId.startsWith("panel_")) {
        return client.buttons.get("panel")(client, interaction);
      }

      const [accion, discordId] = interaction.customId.split("_");
      const player = await buscarJugador(discordId);

      if (!player) {
        return interaction.reply({
          content: "❌ Jugador no encontrado.",
          ephemeral: true
        });
      }

      if (accion === "aprobar") {
        return client.buttons.get("aprobar")(client, interaction, discordId, player);
      }

      if (accion === "rechazar") {
        return client.buttons.get("rechazar")(client, interaction, discordId, player);
      }

      if (accion === "banear") {
        return client.buttons.get("banear")(client, interaction, discordId, player);
      }
    }
  } catch (err) {
    console.error("❌ Error en interactionCreate:", err);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "❌ Ocurrió un error inesperado.",
        ephemeral: true
      }).catch(() => {});
    }
  }
};
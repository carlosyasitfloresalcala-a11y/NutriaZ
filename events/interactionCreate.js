const { esAdmin } = require("../utils/permisos");
const { buscarJugador } = require("../utils/database");

module.exports = async (client, interaction) => {

    try {

        // ===========================
        // SLASH COMMANDS
        // ===========================

        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            if (
                interaction.commandName !== "registro" &&
                !esAdmin(interaction.member)
            ) {
                return interaction.reply({
                    content: "❌ Solo administradores.",
                    ephemeral: true
                });
            }

            return command.execute(client, interaction);

        }

        // ===========================
        // MODALS
        // ===========================

        if (interaction.isModalSubmit()) {

            if (interaction.customId === "modal_registro") {

                return client.buttons
                    .get("registroModal")
                    ?.(
                        client,
                        interaction
                    );

            }

            if (interaction.customId.startsWith("modal_rechazar_")) {

                return client.buttons
                    .get("rechazoModal")
                    ?.(
                        client,
                        interaction
                    );

            }

            if (interaction.customId.startsWith("modal_banear_")) {

                return client.buttons
                    .get("banModal")
                    ?.(
                        client,
                        interaction
                    );

            }

            return;

        }

        // ===========================
        // BOTONES
        // ===========================

        if (interaction.isButton()) {

            if (!esAdmin(interaction.member)) {

                return interaction.reply({
                    content: "❌ Solo administradores.",
                    ephemeral: true
                });

            }

            // Dashboard

            if (interaction.customId === "dash_home")
                return client.buttons.get("dashboard")(client, interaction);

            if (interaction.customId === "dash_whitelist")
                return client.buttons.get("whitelistMenu")(client, interaction);

            if (interaction.customId === "dash_jugadores")
                return client.buttons.get("jugadoresMenu")(client, interaction);

            if (interaction.customId.startsWith("panel_"))
                return client.buttons.get("panel")(client, interaction);

            // Solicitudes

            const [accion, discordId] = interaction.customId.split("_");

            const player = buscarJugador(discordId);

            if (!player) {

                return interaction.reply({
                    content: "❌ Jugador no encontrado.",
                    ephemeral: true
                });

            }

            if (accion === "aprobar")
                return client.buttons.get("aprobar")(client, interaction, discordId, player);

            if (accion === "rechazar")
                return client.buttons.get("rechazar")(client, interaction, discordId, player);

            if (accion === "banear")
                return client.buttons.get("banear")(client, interaction, discordId, player);

        }

    }

    catch (err) {

        console.error(err);

    }

};
require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Collection,
    REST,
    Routes
} = require("discord.js");

const config = require("./config");

const conectarMongo = require("./database/mongo");

const loadCommands = require("./handlers/loadCommands");
const loadButtons = require("./handlers/loadButtons");

const interactionCreate = require("./events/interactionCreate");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();
client.buttons = new Map();

async function registrarComandos(commandsArray) {

    const rest = new REST({
        version: "10"
    }).setToken(config.token);

    console.log("");
    console.log("========================================");
    console.log("📡 Registrando Slash Commands...");
    console.log("========================================");

    await rest.put(
        Routes.applicationGuildCommands(
            config.clientId,
            config.guildId
        ),
        {
            body: commandsArray
        }
    );

    console.log("✅ Slash Commands registrados.");
    console.log("========================================");
}

client.once("ready", () => {

    console.clear();

    console.log("");
    console.log("========================================");
    console.log("🦦 NUTRIA BOT");
    console.log("========================================");
    console.log(`🤖 Bot: ${client.user.tag}`);
    console.log(`🆔 ID: ${client.user.id}`);
    console.log(`🏠 Servidores: ${client.guilds.cache.size}`);
    console.log(`👥 Usuarios: ${client.users.cache.size}`);
    console.log("========================================");
    console.log("🟢 BOT ONLINE");
    console.log("========================================");
    console.log("");

});

client.on("interactionCreate", async interaction => {

    await interactionCreate(client, interaction);

});

(async () => {

    try {

        // ==========================
        // Conectar MongoDB
        // ==========================

        await conectarMongo();

        // ==========================
        // Cargar comandos
        // ==========================

        const commandsArray = loadCommands(client);

        // ==========================
        // Cargar botones
        // ==========================

        loadButtons(client);

        // ==========================
        // Registrar Slash Commands
        // ==========================

        await registrarComandos(commandsArray);

        // ==========================
        // Login
        // ==========================

        await client.login(config.token);

    } catch (error) {

        console.error("");
        console.error("❌ ERROR INICIANDO EL BOT");
        console.error(error);
        console.error("");

    }

})();
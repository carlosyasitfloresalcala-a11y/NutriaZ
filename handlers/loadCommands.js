const fs = require("fs");
const path = require("path");

function loadCommands(client) {
  client.commands.clear();

  const commandsPath = path.join(__dirname, "..", "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

  const commandsArray = [];

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    delete require.cache[require.resolve(filePath)];

    const command = require(filePath);

    if (!command.data || !command.execute) {
      console.warn(`⚠️ Comando inválido ignorado: ${file}`);
      continue;
    }

    client.commands.set(command.data.name, command);
    commandsArray.push(command.data.toJSON());

    console.log(`✅ Comando cargado: /${command.data.name}`);
  }

  return commandsArray;
}

module.exports = loadCommands;
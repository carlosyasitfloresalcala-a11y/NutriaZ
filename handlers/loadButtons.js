const fs = require("fs");
const path = require("path");

function loadButtons(client) {
  client.buttons = new Map();

  const buttonsPath = path.join(__dirname, "..", "interactions", "buttons");

  if (!fs.existsSync(buttonsPath)) {
    console.warn("⚠️ No existe la carpeta interactions/buttons");
    return;
  }

  const buttonFiles = fs
    .readdirSync(buttonsPath)
    .filter(file => file.endsWith(".js"));

  for (const file of buttonFiles) {
    const filePath = path.join(buttonsPath, file);
    delete require.cache[require.resolve(filePath)];

    const button = require(filePath);

    const name = file.replace(".js", "");
    client.buttons.set(name, button);

    console.log(`✅ Botón cargado: ${name}`);
  }
}

module.exports = loadButtons;
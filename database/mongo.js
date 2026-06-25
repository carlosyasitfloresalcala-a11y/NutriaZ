const mongoose = require("mongoose");

async function conectarMongo() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB conectado correctamente.");
  } catch (error) {
    console.error("❌ Error conectando MongoDB:");
    console.error(error);
  }
}

module.exports = conectarMongo;
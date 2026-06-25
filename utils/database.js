const Player = require("../models/Player");
const Counter = require("../models/Counter");

async function generarExpediente() {
  const counter = await Counter.findOneAndUpdate(
    { name: "expedientes" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return `WL-${String(counter.value).padStart(6, "0")}`;
}

async function leerDB() {
  const players = await Player.find().lean();

  return {
    players
  };
}

async function buscarJugador(discordId) {
  return await Player.findOne({ discordId }).lean();
}

async function buscarPorExpediente(expediente) {
  return await Player.findOne({ expediente }).lean();
}

async function guardarJugador(jugador) {
  let player = await Player.findOne({ discordId: jugador.discordId });

  if (!player) {
    if (!jugador.expediente) {
      jugador.expediente = await generarExpediente();
    }

    player = new Player(jugador);
    await player.save();

    return player.toObject();
  }

  Object.assign(player, jugador);
  await player.save();

  return player.toObject();
}

async function agregarHistorial(discordId, accion, detalle, adminId = null) {
  const movimiento = {
    accion,
    detalle,
    adminId,
    fecha: new Date().toISOString()
  };

  const player = await Player.findOneAndUpdate(
    { discordId },
    {
      $push: { historial: movimiento }
    },
    { new: true }
  );

  return player ? player.toObject() : null;
}

module.exports = {
  leerDB,
  buscarJugador,
  buscarPorExpediente,
  guardarJugador,
  agregarHistorial
};
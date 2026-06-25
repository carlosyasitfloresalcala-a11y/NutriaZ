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
  return { players };
}

async function buscarJugador(discordId) {
  return await Player.findOne({ discordId }).lean();
}

async function buscarPorExpediente(expediente) {
  return await Player.findOne({ expediente }).lean();
}

async function guardarJugador(data) {
  let player = await Player.findOne({ discordId: data.discordId });

  if (!player) {
    const expediente = data.expediente || await generarExpediente();

    player = new Player({
      expediente,
      discordId: data.discordId,
      discordTag: data.discordTag || data.username || "Sin tag",
      avatar: data.avatar || null,
      gamertag: data.gamertag,
      edad: Number(data.edad) || null,
      pais: data.pais,
      experiencia: data.experiencia || data.plataforma || "No especificada",
      estado: data.estado || data.status || "Pendiente",
      fechaRegistro: data.fechaRegistro || new Date(),
      ultimoCambio: new Date(),
      advertencias: data.advertencias || [],
      notas: data.notas || [],
      historial: data.historial || []
    });

    await player.save();
    return player.toObject();
  }

  if (data.discordTag || data.username) player.discordTag = data.discordTag || data.username;
  if (data.avatar) player.avatar = data.avatar;
  if (data.gamertag) player.gamertag = data.gamertag;
  if (data.edad) player.edad = Number(data.edad);
  if (data.pais) player.pais = data.pais;
  if (data.experiencia || data.plataforma) player.experiencia = data.experiencia || data.plataforma;
  if (data.estado || data.status) player.estado = data.estado || data.status;

  if (data.aprobadoPor || data.approvedBy) player.aprobadoPor = data.aprobadoPor || data.approvedBy;
  if (data.fechaAprobacion || data.approvedAt) player.fechaAprobacion = data.fechaAprobacion || data.approvedAt;

  player.ultimoCambio = new Date();

  await player.save();
  return player.toObject();
}

async function agregarHistorial(discordId, accion, motivo, staffId = null, staffTag = null) {
  const movimiento = {
    accion,
    staffId,
    staffTag,
    motivo,
    fecha: new Date()
  };

  const player = await Player.findOneAndUpdate(
    { discordId },
    {
      $push: { historial: movimiento },
      $set: { ultimoCambio: new Date() }
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
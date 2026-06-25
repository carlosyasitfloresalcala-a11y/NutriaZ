const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  expediente: String,
  discordId: { type: String, required: true, unique: true },
  username: String,
  gamertag: String,
  plataforma: String,
  edad: String,
  pais: String,
  status: { type: String, default: "pendiente" },
  warnings: { type: Number, default: 0 },
  banReason: String,
  approvedBy: String,
  approvedAt: String,
  rejectedBy: String,
  rejectedAt: String,
  rejectReason: String,
  bannedBy: String,
  bannedAt: String,
  historial: {
    type: Array,
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Player", playerSchema);
const mongoose = require("mongoose");

const historialSchema = new mongoose.Schema({
    accion: String,
    staffId: String,
    staffTag: String,
    motivo: String,
    fecha: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const notaSchema = new mongoose.Schema({
    staffId: String,
    staffTag: String,
    texto: String,
    fecha: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const advertenciaSchema = new mongoose.Schema({
    staffId: String,
    staffTag: String,
    motivo: String,
    fecha: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const playerSchema = new mongoose.Schema({

    expediente: {
        type: String,
        unique: true
    },

    discordId: {
        type: String,
        required: true,
        unique: true
    },

    discordTag: String,

    avatar: String,

    gamertag: String,

    edad: Number,

    pais: String,

    experiencia: String,

    estado: {
        type: String,
        default: "Pendiente"
    },

    aprobadoPor: String,

    fechaRegistro: {
        type: Date,
        default: Date.now
    },

    fechaAprobacion: Date,

    ultimoCambio: {
        type: Date,
        default: Date.now
    },

    advertencias: [advertenciaSchema],

    notas: [notaSchema],

    historial: [historialSchema]

});

module.exports = mongoose.model("Player", playerSchema);
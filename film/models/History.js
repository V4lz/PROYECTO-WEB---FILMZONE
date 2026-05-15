
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contenido: { type: mongoose.Schema.Types.ObjectId, required: true },
  tipo_contenido: { type: String, enum: ['movie', 'series'], required: true },
  fecha_visualizacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);


const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  descripcion: { type: String, required: true },
  fecha_estreno: { type: Date },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  url_trailer: { type: String, required: true },
  imagen_portada: { type: String, required: true }
});

module.exports = mongoose.model('Movie', movieSchema);

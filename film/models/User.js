
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  tipo_usuario: { type: String, enum: ['admin', 'user'], default: 'user' },
  perfiles: [{ type: String, trim: true }],
  fecha_registro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

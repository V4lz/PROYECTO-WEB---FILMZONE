
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');
const router = express.Router();

function crearToken(user) {
  return jwt.sign({ id: user._id, tipo_usuario: user.tipo_usuario }, process.env.JWT_SECRET || 'filmzone_secreto_cambialo', { expiresIn: '8h' });
}

router.post('/register', async (req, res) => {
  try {
    const { nombre, email, contraseña, password } = req.body;
    const finalPassword = contraseña || password;
    if (!nombre || !email || !finalPassword) return res.status(400).json({ message: 'Faltan datos' });

    const existe = await User.findOne({ email });
    if (existe) return res.status(409).json({ message: 'El correo ya está registrado' });

    const hash = await bcrypt.hash(finalPassword, 10);
    const user = await User.create({ nombre, email, password: hash, perfiles: [nombre] });
    res.status(201).json({ message: 'Usuario registrado', user: { id: user._id, nombre: user.nombre, email: user.email, tipo_usuario: user.tipo_usuario } });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, contraseña, password } = req.body;
    const finalPassword = contraseña || password;
    if (!email || !finalPassword) return res.status(400).json({ message: 'Faltan datos' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'El usuario no existe' });

    const ok = await bcrypt.compare(finalPassword, user.password);
    if (!ok) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = crearToken(user);
    res.json({ token, user: { id: user._id, nombre: user.nombre, email: user.email, tipo_usuario: user.tipo_usuario, perfiles: user.perfiles } });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

router.get('/', auth, adminOnly, async (_req, res) => {
  const users = await User.find().select('-password').sort({ fecha_registro: -1 });
  res.json(users);
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  const { tipo_usuario } = req.body;
  if (!['admin', 'user'].includes(tipo_usuario)) return res.status(400).json({ message: 'Rol no válido' });
  const user = await User.findByIdAndUpdate(req.params.id, { tipo_usuario }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(user);
});


router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (user.tipo_usuario === 'admin') {
      return res.status(403).json({ message: 'No puedes eliminar administradores' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

router.get('/me', auth, (req, res) => res.json(req.user));

router.post('/profiles', auth, async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ message: 'Falta el nombre del perfil' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (user.perfiles.length >= 4) {
      return res.status(400).json({ message: 'Máximo 4 perfiles por cuenta' });
    }

    if (!user.perfiles.includes(nombre)) {
      user.perfiles.push(nombre);
      await user.save();
    }

    res.status(201).json(user.perfiles);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar perfil' });
  }
});

router.delete('/profiles/:nombre', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (user.perfiles.length <= 1) {
      return res.status(400).json({ message: 'Debe existir al menos un perfil' });
    }

    user.perfiles = user.perfiles.filter(p => p !== req.params.nombre);
    await user.save();

    res.json(user.perfiles);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar perfil' });
  }
});

module.exports = router;

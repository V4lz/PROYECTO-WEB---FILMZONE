
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function auth(req, res, next) {
  try {
    const token = req.header('x-auth') || (req.header('Authorization') || '').replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No se envió token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'filmzone_secreto_cambialo');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Usuario no válido' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.tipo_usuario !== 'admin') {
    return res.status(403).json({ message: 'Solo administrador' });
  }
  next();
}

module.exports = { auth, adminOnly };

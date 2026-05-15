
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const usersRoutes = require('./routes/users');
const contentRoutes = require('./routes/content');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.use('/users', usersRoutes);
app.use('/', contentRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true, proyecto: 'FILMZONE' }));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/filmzone';

mongoose.connect(MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`FILMZONE listo en http://localhost:${PORT}`)))
  .catch(err => {
    console.error('No se pudo conectar a MongoDB:', err.message);
    process.exit(1);
  });

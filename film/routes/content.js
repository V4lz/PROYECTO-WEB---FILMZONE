
const express = require('express');
const Movie = require('../models/Movie');
const Series = require('../models/Series');
const Category = require('../models/Category');
const History = require('../models/History');
const { auth, adminOnly } = require('../middleware/auth');
const router = express.Router();

function filtroBusqueda(query) {
  return query ? { titulo: { $regex: query, $options: 'i' } } : {};
}

router.get('/movies', async (req, res) => {
  const movies = await Movie.find(filtroBusqueda(req.query.query)).populate('categoria').sort({ titulo: 1 });
  res.json(movies);
});
router.get('/movies/category/:id', async (req, res) => {
  res.json(await Movie.find({ categoria: req.params.id }).populate('categoria'));
});
router.get('/movies/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id).populate('categoria');
  if (!movie) return res.status(404).json({ message: 'Película no encontrada' });
  res.json(movie);
});

router.get('/series', async (req, res) => {
  const series = await Series.find(filtroBusqueda(req.query.query)).populate('categoria').sort({ titulo: 1 });
  res.json(series);
});
router.get('/series/category/:id', async (req, res) => {
  res.json(await Series.find({ categoria: req.params.id }).populate('categoria'));
});
router.get('/series/:id', async (req, res) => {
  const item = await Series.findById(req.params.id).populate('categoria');
  if (!item) return res.status(404).json({ message: 'Serie no encontrada' });
  res.json(item);
});

router.get('/categories', async (_req, res) => {
  res.json(await Category.find().sort({ nombre: 1 }));
});

router.get('/content/:id/trailer', async (req, res) => {
  const item = await Movie.findById(req.params.id) || await Series.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Contenido no encontrado' });
  res.json({ url_trailer: item.url_trailer });
});

router.post('/history', auth, async (req, res) => {
  const { contenido, tipo_contenido } = req.body;
  if (!contenido || !tipo_contenido) return res.status(400).json({ message: 'Faltan datos' });
  const history = await History.create({ usuario: req.user._id, contenido, tipo_contenido });
  res.status(201).json(history);
});
router.get('/history', auth, async (req, res) => {
  res.json(await History.find({ usuario: req.user._id }).sort({ fecha_visualizacion: -1 }));
});

router.post('/admin/movies', auth, adminOnly, async (req, res) => res.status(201).json(await Movie.create(req.body)));
router.put('/admin/movies/:id', auth, adminOnly, async (req, res) => res.json(await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/admin/movies/:id', auth, adminOnly, async (req, res) => { await Movie.findByIdAndDelete(req.params.id); res.json({ message: 'Película eliminada' }); });

router.post('/admin/series', auth, adminOnly, async (req, res) => res.status(201).json(await Series.create(req.body)));
router.put('/admin/series/:id', auth, adminOnly, async (req, res) => res.json(await Series.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/admin/series/:id', auth, adminOnly, async (req, res) => { await Series.findByIdAndDelete(req.params.id); res.json({ message: 'Serie eliminada' }); });

router.post('/admin/categories', auth, adminOnly, async (req, res) => res.status(201).json(await Category.create(req.body)));
router.put('/admin/categories/:id', auth, adminOnly, async (req, res) => res.json(await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/admin/categories/:id', auth, adminOnly, async (req, res) => { await Category.findByIdAndDelete(req.params.id); res.json({ message: 'Categoría eliminada' }); });

module.exports = router;

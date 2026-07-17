const express = require('express');
const authRoutes = require('./auth.routes');
const bookRoutes = require('./book.routes');
const categoryRoutes = require('./category.routes');
const favoriteRoutes = require('./favorite.routes');
const reportRoutes = require('./report.routes');

const router = express.Router();

router.get('/health', (req, res) => res.json({ success: true, message: 'API is healthy' }));

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/categories', categoryRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/reports', reportRoutes);

module.exports = router;

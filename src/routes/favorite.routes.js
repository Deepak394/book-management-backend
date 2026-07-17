const express = require('express');
const favoriteController = require('../controllers/favorite.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', favoriteController.getFavorites);
router.post('/:bookId', favoriteController.addFavorite);
router.delete('/:bookId', favoriteController.removeFavorite);

module.exports = router;

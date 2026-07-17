const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const favoriteService = require('../services/favorite.service');

const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await favoriteService.list(req.user._id);
  ApiResponse.send(res, 200, favorites, 'Favorites fetched');
});

const addFavorite = asyncHandler(async (req, res) => {
  await favoriteService.add(req.user._id, req.params.bookId);
  ApiResponse.send(res, 201, null, 'Book added to favorites');
});

const removeFavorite = asyncHandler(async (req, res) => {
  await favoriteService.remove(req.user._id, req.params.bookId);
  ApiResponse.send(res, 200, null, 'Book removed from favorites');
});

module.exports = { getFavorites, addFavorite, removeFavorite };

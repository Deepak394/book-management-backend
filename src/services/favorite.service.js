const favoriteRepository = require('../repositories/favorite.repository');
const bookRepository = require('../repositories/book.repository');
const ApiError = require('../utils/ApiError');

const favoriteService = {
  async list(userId) {
    const favorites = await favoriteRepository.findByUser(userId);
    return favorites.filter((f) => f.bookId).map((f) => ({
      favoriteId: f._id,
      createdAt: f.createdAt,
      book: f.bookId,
    }));
  },

  async add(userId, bookId) {
    const book = await bookRepository.findById(bookId);
    if (!book) throw ApiError.notFound('Book not found');

    const existing = await favoriteRepository.findOne(userId, bookId);
    if (existing) throw ApiError.conflict('Book is already in favorites');

    return favoriteRepository.create(userId, bookId);
  },

  async remove(userId, bookId) {
    const removed = await favoriteRepository.deleteOne(userId, bookId);
    if (!removed) throw ApiError.notFound('Favorite not found');
    return true;
  },
};

module.exports = favoriteService;

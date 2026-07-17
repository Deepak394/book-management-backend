const Book = require('../models/Book');
const User = require('../models/User');
const bookRepository = require('../repositories/book.repository');
const favoriteRepository = require('../repositories/favorite.repository');
const categoryRepository = require('../repositories/category.repository');

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

const reportService = {
  async dashboard() {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const [totalBooks, totalUsers, favoriteCount, booksAddedThisMonth, categories, topFavorited] =
      await Promise.all([
        bookRepository.countAll(),
        User.countDocuments({ role: 'user' }),
        favoriteRepository.countAll(),
        bookRepository.countCreatedBetween(monthStart, monthEnd),
        categoryRepository.findAll({ level: 3 }),
        favoriteRepository.topFavoritedBooks(5),
      ]);

    const booksByCategory = await Book.aggregate([
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, categoryId: '$_id', name: '$category.name', count: 1 } },
      { $sort: { count: -1 } },
    ]);

    return {
      totalBooks,
      totalUsers,
      favoriteCount,
      booksAddedThisMonth,
      totalLeafCategories: categories.length,
      topFavoritedBooks: topFavorited,
      booksByCategory,
    };
  },

  async favoritesReport() {
    const now = new Date();
    const last30Start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [favoritesLastMonth, dailySeries, topFavorited] = await Promise.all([
      favoriteRepository.countCreatedBetween(last30Start, now),
      favoriteRepository.favoritesPerDay(last30Start, now),
      favoriteRepository.topFavoritedBooks(10),
    ]);

    return {
      rangeStart: last30Start,
      rangeEnd: now,
      favoritesLastMonth,
      dailySeries,
      topFavoritedBooks: topFavorited,
    };
  },
};

module.exports = reportService;

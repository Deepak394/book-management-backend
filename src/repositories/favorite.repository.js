const Favorite = require('../models/Favorite');

const favoriteRepository = {
  create: (userId, bookId) => Favorite.create({ userId, bookId }),

  findOne: (userId, bookId) => Favorite.findOne({ userId, bookId }),

  findByUser: (userId) =>
    Favorite.find({ userId }).populate({
      path: 'bookId',
      populate: { path: 'categoryId' },
    }),

  deleteOne: (userId, bookId) => Favorite.findOneAndDelete({ userId, bookId }),

  countAll: () => Favorite.countDocuments(),

  countCreatedBetween: (start, end) =>
    Favorite.countDocuments({ createdAt: { $gte: start, $lte: end } }),

  countByBookIds: (bookIds) =>
    Favorite.aggregate([
      { $match: { bookId: { $in: bookIds } } },
      { $group: { _id: '$bookId', count: { $sum: 1 } } },
    ]),

  favoritesPerDay: (start, end) =>
    Favorite.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

  topFavoritedBooks: (limit = 5) =>
    Favorite.aggregate([
      { $group: { _id: '$bookId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' },
      },
      { $unwind: '$book' },
      { $project: { _id: 0, bookId: '$_id', title: '$book.title', count: 1 } },
    ]),
};

module.exports = favoriteRepository;

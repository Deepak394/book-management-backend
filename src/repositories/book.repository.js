const Book = require('../models/Book');

const bookRepository = {
  create: (data) => Book.create(data),

  findById: (id) => Book.findById(id).populate('categoryId'),

  findAll: async ({ filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 20 }) => {
    const [items, total] = await Promise.all([
      Book.find(filter).populate('categoryId').sort(sort).skip(skip).limit(limit),
      Book.countDocuments(filter),
    ]);
    return { items, total };
  },

  countAll: (filter = {}) => Book.countDocuments(filter),

  countCreatedBetween: (start, end) =>
    Book.countDocuments({ createdAt: { $gte: start, $lte: end } }),

  updateById: (id, data) =>
    Book.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('categoryId'),

  deleteById: (id) => Book.findByIdAndDelete(id),

  existsByCategory: (categoryId) => Book.exists({ categoryId }),

  findByIds: (ids) => Book.find({ _id: { $in: ids } }).populate('categoryId'),
};

module.exports = bookRepository;

const Category = require('../models/Category');

const categoryRepository = {
  create: (data) => Category.create(data),
  findById: (id) => Category.findById(id),
  findAll: (filter = {}) => Category.find(filter).sort({ name: 1 }),
  findChildren: (parentId) => Category.find({ parentId }).sort({ name: 1 }),
  updateById: (id, data) =>
    Category.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  deleteById: (id) => Category.findByIdAndDelete(id),
  countChildren: (parentId) => Category.countDocuments({ parentId }),
};

module.exports = categoryRepository;

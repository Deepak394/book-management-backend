const fs = require('fs');
const path = require('path');
const bookRepository = require('../repositories/book.repository');
const categoryRepository = require('../repositories/category.repository');
const categoryService = require('./category.service');
const Favorite = require('../models/Favorite');
const ApiError = require('../utils/ApiError');

const DEFAULT_PAGE_SIZE = 20;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function collectDescendantCategoryIds(categoryId) {
  const ids = [categoryId];
  const children = await categoryRepository.findChildren(categoryId);
  for (const child of children) {
    const nested = await collectDescendantCategoryIds(child._id.toString());
    ids.push(...nested);
  }
  return ids;
}

function removeImageFile(imagePath) {
  if (!imagePath) return;
  const absolute = path.join(__dirname, '..', '..', imagePath.replace(/^\/+/, ''));
  fs.unlink(absolute, () => {});
}

const bookService = {
  async list({ page = 1, limit = DEFAULT_PAGE_SIZE, search, categoryId }) {
    const filter = {};

    if (search) {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { author: { $regex: safeSearch, $options: 'i' } },
        { isbn: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    if (categoryId) {
      const categoryIds = await collectDescendantCategoryIds(categoryId);
      filter.categoryId = { $in: categoryIds };
    }

    const skip = (page - 1) * limit;
    const { items, total } = await bookRepository.findAll({ filter, skip, limit });

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },

  async getById(id) {
    const book = await bookRepository.findById(id);
    if (!book) throw ApiError.notFound('Book not found');
    const breadcrumb = await categoryService.getBreadcrumb(book.categoryId._id);
    return { book, breadcrumb };
  },

  async create(data) {
    await categoryService.assertLeaf(data.categoryId);
    return bookRepository.create(data);
  },

  async update(id, data) {
    const existing = await bookRepository.findById(id);
    if (!existing) throw ApiError.notFound('Book not found');

    if (data.categoryId) {
      await categoryService.assertLeaf(data.categoryId);
    }

    if (data.image && existing.image && data.image !== existing.image) {
      removeImageFile(existing.image);
    }

    return bookRepository.updateById(id, data);
  },

  async remove(id) {
    const existing = await bookRepository.findById(id);
    if (!existing) throw ApiError.notFound('Book not found');

    await bookRepository.deleteById(id);
    await Favorite.deleteMany({ bookId: id });
    removeImageFile(existing.image);
    return true;
  },
};

module.exports = bookService;

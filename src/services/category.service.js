const categoryRepository = require('../repositories/category.repository');
const bookRepository = require('../repositories/book.repository');
const ApiError = require('../utils/ApiError');

async function resolveLevel(parentId) {
  if (!parentId) return 1;
  const parent = await categoryRepository.findById(parentId);
  if (!parent) throw ApiError.badRequest('Parent category not found');
  if (parent.level >= 3) {
    throw ApiError.badRequest('Leaf categories cannot have children (max 3 levels)');
  }
  return parent.level + 1;
}

const categoryService = {
  async create({ name, parentId }) {
    const level = await resolveLevel(parentId || null);
    return categoryRepository.create({ name, parentId: parentId || null, level });
  },

  async getTree() {
    const all = await categoryRepository.findAll();
    const byParent = new Map();
    all.forEach((cat) => {
      const key = cat.parentId ? cat.parentId.toString() : 'root';
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key).push(cat);
    });

    const build = (parentKey) =>
      (byParent.get(parentKey) || []).map((cat) => ({
        ...cat.toObject(),
        children: build(cat._id.toString()),
      }));

    return build('root');
  },

  async getAllFlat(filter = {}) {
    return categoryRepository.findAll(filter);
  },

  async getById(id) {
    const category = await categoryRepository.findById(id);
    if (!category) throw ApiError.notFound('Category not found');
    return category;
  },

  async update(id, { name, parentId }) {
    const category = await categoryRepository.findById(id);
    if (!category) throw ApiError.notFound('Category not found');

    const updateData = { name };

    if (parentId !== undefined && String(parentId || '') !== String(category.parentId || '')) {
      if (String(parentId) === String(id)) {
        throw ApiError.badRequest('A category cannot be its own parent');
      }
      const level = await resolveLevel(parentId || null);
      updateData.parentId = parentId || null;
      updateData.level = level;
    }

    return categoryRepository.updateById(id, updateData);
  },

  async remove(id) {
    const category = await categoryRepository.findById(id);
    if (!category) throw ApiError.notFound('Category not found');

    const childCount = await categoryRepository.countChildren(id);
    if (childCount > 0) {
      throw ApiError.badRequest('Cannot delete a category that has child categories');
    }

    const hasBooks = await bookRepository.existsByCategory(id);
    if (hasBooks) {
      throw ApiError.badRequest('Cannot delete a category that has books assigned to it');
    }

    await categoryRepository.deleteById(id);
    return true;
  },

  async assertLeaf(categoryId) {
    const category = await categoryRepository.findById(categoryId);
    if (!category) throw ApiError.badRequest('Category not found');
    if (category.level !== 3) {
      throw ApiError.badRequest('Only leaf categories can be assigned to books');
    }
    return category;
  },

  async getBreadcrumb(categoryId) {
    const trail = [];
    let current = await categoryRepository.findById(categoryId);
    while (current) {
      trail.unshift(current);
      current = current.parentId ? await categoryRepository.findById(current.parentId) : null;
    }
    return trail;
  },
};

module.exports = categoryService;

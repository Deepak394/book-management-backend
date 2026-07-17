const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const categoryService = require('../services/category.service');

const getCategories = asyncHandler(async (req, res) => {
  if (req.query.format === 'flat') {
    const items = await categoryService.getAllFlat();
    return ApiResponse.send(res, 200, items, 'Categories fetched');
  }
  const tree = await categoryService.getTree();
  ApiResponse.send(res, 200, tree, 'Category tree fetched');
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getById(req.params.id);
  ApiResponse.send(res, 200, category, 'Category fetched');
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.create(req.body);
  ApiResponse.send(res, 201, category, 'Category created');
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.update(req.params.id, req.body);
  ApiResponse.send(res, 200, category, 'Category updated');
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.remove(req.params.id);
  ApiResponse.send(res, 200, null, 'Category deleted');
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

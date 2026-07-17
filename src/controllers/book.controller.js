const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const bookService = require('../services/book.service');

const getBooks = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const { search, categoryId } = req.query;

  const { items, pagination } = await bookService.list({ page, limit, search, categoryId });
  ApiResponse.send(res, 200, items, 'Books fetched', pagination);
});

const getBookById = asyncHandler(async (req, res) => {
  const { book, breadcrumb } = await bookService.getById(req.params.id);
  ApiResponse.send(res, 200, { book, breadcrumb }, 'Book fetched');
});

const createBook = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.image = `/uploads/covers/${req.file.filename}`;
  }
  const book = await bookService.create(payload);
  ApiResponse.send(res, 201, book, 'Book created');
});

const updateBook = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.image = `/uploads/covers/${req.file.filename}`;
  }
  const book = await bookService.update(req.params.id, payload);
  ApiResponse.send(res, 200, book, 'Book updated');
});

const deleteBook = asyncHandler(async (req, res) => {
  await bookService.remove(req.params.id);
  ApiResponse.send(res, 200, null, 'Book deleted');
});

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };

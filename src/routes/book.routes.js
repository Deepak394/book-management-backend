const express = require('express');
const bookController = require('../controllers/book.controller');
const { validate } = require('../middlewares/validate.middleware');
const { createBookSchema, updateBookSchema, idParamSchema } = require('../validators/book.validator');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/', bookController.getBooks);
router.get('/:id', validate(idParamSchema), bookController.getBookById);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  validate(createBookSchema),
  bookController.createBook
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  validate(updateBookSchema),
  bookController.updateBook
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(idParamSchema),
  bookController.deleteBook
);

module.exports = router;

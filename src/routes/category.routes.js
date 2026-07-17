const express = require('express');
const categoryController = require('../controllers/category.controller');
const { validate } = require('../middlewares/validate.middleware');
const { createCategorySchema, updateCategorySchema } = require('../validators/category.validator');
const { idParamSchema } = require('../validators/book.validator');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = express.Router();

router.get('/', categoryController.getCategories);
router.get('/:id', validate(idParamSchema), categoryController.getCategoryById);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createCategorySchema),
  categoryController.createCategory
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(idParamSchema),
  categoryController.deleteCategory
);

module.exports = router;

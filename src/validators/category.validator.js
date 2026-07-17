const { z } = require('zod');
const { objectId } = require('./book.validator');

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    parentId: objectId.nullish(),
  }),
});

const updateCategorySchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    parentId: objectId.nullish(),
  }),
});

module.exports = { createCategorySchema, updateCategorySchema };

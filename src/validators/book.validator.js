const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

const createBookSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200),
    author: z.string().min(1, 'Author is required').max(150),
    description: z.string().max(5000).optional().default(''),
    isbn: z.string().min(1, 'ISBN is required'),
    price: z.coerce.number().min(0, 'Price must be a positive number'),
    categoryId: objectId,
    publishDate: z.coerce.date({ errorMap: () => ({ message: 'Invalid published date' }) }),
  }),
});

const updateBookSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    author: z.string().min(1).max(150).optional(),
    description: z.string().max(5000).optional(),
    isbn: z.string().min(1).optional(),
    price: z.coerce.number().min(0).optional(),
    categoryId: objectId.optional(),
    publishDate: z.coerce.date().optional(),
  }),
});

const idParamSchema = z.object({
  params: z.object({ id: objectId }),
});

module.exports = { createBookSchema, updateBookSchema, idParamSchema, objectId };

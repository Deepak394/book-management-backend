const ApiError = require('../utils/ApiError');

// Validates req against a Zod schema shaped as { body?, params?, query? }
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    return next(ApiError.badRequest('Validation failed', details));
  }

  if (result.data.body) req.body = result.data.body;
  next();
};

module.exports = { validate };

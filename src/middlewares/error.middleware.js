const ApiError = require('../utils/ApiError');
const env = require('../config/env');

function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal server error';

    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(error.errors)
        .map((e) => e.message)
        .join(', ');
    } else if (error.name === 'CastError') {
      statusCode = 400;
      message = `Invalid ${error.path}: ${error.value}`;
    } else if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyValue || {})[0];
      message = field ? `${field} already exists` : 'Duplicate value';
    } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Invalid or expired token';
    } else if (error.name === 'MulterError') {
      statusCode = 400;
      message = error.message;
    }

    error = new ApiError(statusCode, message);
  }

  if (env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    statusCode: error.statusCode || 500,
    message: error.message,
    ...(error.details ? { details: error.details } : {}),
    ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
}

module.exports = { notFoundHandler, errorHandler };

const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const authenticate = asyncHandler(async (req, res, next) => {
  const bearer = req.headers.authorization;
  const tokenFromHeader = bearer && bearer.startsWith('Bearer ') ? bearer.split(' ')[1] : null;
  const token = tokenFromHeader || req.cookies?.token;

  if (!token) {
    throw ApiError.unauthorized('Authentication token missing');
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired token');
  }

  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    throw ApiError.unauthorized('User no longer exists');
  }

  req.user = user;
  next();
});

// Attaches req.user if a valid token is present, but does not fail the request otherwise.
const optionalAuthenticate = asyncHandler(async (req, res, next) => {
  const bearer = req.headers.authorization;
  const tokenFromHeader = bearer && bearer.startsWith('Bearer ') ? bearer.split(' ')[1] : null;
  const token = tokenFromHeader || req.cookies?.token;

  if (!token) return next();

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (user) req.user = user;
  } catch (err) {
    // ignore invalid token for optional auth
  }
  next();
});

module.exports = { authenticate, optionalAuthenticate };

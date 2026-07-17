const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/auth.service');
const env = require('../config/env');

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: env.JWT_COOKIE_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
};

const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  res.cookie('token', token, cookieOptions);
  ApiResponse.send(res, 201, { user, token }, 'Registration successful');
});

const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  res.cookie('token', token, cookieOptions);
  ApiResponse.send(res, 200, { user, token }, 'Login successful');
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', cookieOptions);
  ApiResponse.send(res, 200, null, 'Logout successful');
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  ApiResponse.send(res, 200, user, 'Profile fetched');
});

module.exports = { register, login, logout, me };

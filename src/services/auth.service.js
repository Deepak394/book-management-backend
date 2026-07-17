const userRepository = require('../repositories/user.repository');
const ApiError = require('../utils/ApiError');
const { signToken } = require('../utils/jwt');

const authService = {
  async register({ name, email, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw ApiError.conflict('Email already registered');

    const user = await userRepository.create({ name, email, password, role: 'user' });
    const token = signToken({ id: user._id, role: user.role });
    return { user: user.toSafeObject(), token };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email, true);
    if (!user) throw ApiError.unauthorized('Invalid email or password');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw ApiError.unauthorized('Invalid email or password');

    const token = signToken({ id: user._id, role: user.role });
    return { user: user.toSafeObject(), token };
  },

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    return user.toSafeObject();
  },
};

module.exports = authService;

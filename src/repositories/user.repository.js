const User = require('../models/User');

const userRepository = {
  create: (data) => User.create(data),
  findById: (id) => User.findById(id),
  findByEmail: (email, withPassword = false) => {
    const query = User.findOne({ email });
    return withPassword ? query.select('+password') : query;
  },
  findAll: (filter = {}) => User.find(filter).select('-password'),
  countAll: (filter = {}) => User.countDocuments(filter),
  updateById: (id, data) => User.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  deleteById: (id) => User.findByIdAndDelete(id),
};

module.exports = userRepository;

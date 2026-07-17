require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/book_management',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  JWT_COOKIE_EXPIRES_DAYS: parseInt(process.env.JWT_COOKIE_EXPIRES_DAYS, 10) || 1,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MAX_UPLOAD_SIZE_MB: parseInt(process.env.MAX_UPLOAD_SIZE_MB, 10) || 5,
};

module.exports = env;

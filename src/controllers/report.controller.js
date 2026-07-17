const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const reportService = require('../services/report.service');

const getDashboard = asyncHandler(async (req, res) => {
  const stats = await reportService.dashboard();
  ApiResponse.send(res, 200, stats, 'Dashboard stats fetched');
});

const getFavoritesReport = asyncHandler(async (req, res) => {
  const report = await reportService.favoritesReport();
  ApiResponse.send(res, 200, report, 'Favorites report fetched');
});

module.exports = { getDashboard, getFavoritesReport };

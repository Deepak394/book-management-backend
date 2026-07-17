const express = require('express');
const reportController = require('../controllers/report.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/dashboard', reportController.getDashboard);
router.get('/favorites', reportController.getFavoritesReport);

module.exports = router;

const express = require('express');
const {
  getDashboardStats,
  getOrders,
  updateOrder,
  getCustomers,
  getAnalytics,
  getProfile,
  updateProfile,
  getStoreSettings,
  updateStoreSettings,
} = require('../controllers/admin.controller');
const { protect, authorizeRoles } = require('../middlewares/auth.middleware');
const { cache } = require('../middlewares/cache.middleware');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/dashboard', cache('admin_dashboard_stats', 300), getDashboardStats);
router.get('/orders', getOrders);
router.patch('/orders/:id', updateOrder);
router.get('/customers', getCustomers);
router.get('/analytics', getAnalytics);
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.get('/store', getStoreSettings);
router.patch('/store', updateStoreSettings);

module.exports = router;

const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require('../controllers/notification.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getMyNotifications);
router.put('/:id/read', markNotificationRead);
router.put('/read-all', markAllNotificationsRead);

module.exports = router;


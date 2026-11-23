const express = require('express');
const router = express.Router();
const { verifyTicket, undoCheckIn, getDoorList } = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

// Admin-only door check-in management
router.post('/verify', authorize('admin'), verifyTicket);
router.post('/:id/undo-checkin', authorize('admin'), undoCheckIn);
router.get('/door-list/:eventId', authorize('admin'), getDoorList);

module.exports = router;

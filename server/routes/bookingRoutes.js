const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getFacultySessions,
  getAllBookings,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/faculty-sessions', authorize('faculty', 'admin'), getFacultySessions);
router.get('/', authorize('admin'), getAllBookings);
router.put('/:id/status', authorize('faculty', 'admin'), updateBookingStatus);
router.put('/:id/cancel', cancelBooking);

module.exports = router;


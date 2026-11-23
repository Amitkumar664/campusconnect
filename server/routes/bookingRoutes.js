const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getMyBookings,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/my', getMyBookings);
router.get('/', authorize('admin'), getAllBookings);
router.put('/:id/cancel', cancelBooking);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAllFaculty,
  getFacultyById,
  getFacultySlotsForDate,
  updateAvailability,
  blockDate,
  unblockDate
} = require('../controllers/facultyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getAllFaculty);
router.get('/:id', getFacultyById);
router.get('/:id/slots', protect, getFacultySlotsForDate);

// Faculty specific endpoints
router.put('/availability', protect, authorize('faculty', 'admin'), updateAvailability);
router.post('/block-date', protect, authorize('faculty', 'admin'), blockDate);
router.delete('/block-date', protect, authorize('faculty', 'admin'), unblockDate);

module.exports = router;


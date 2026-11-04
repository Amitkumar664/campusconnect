const express = require('express');
const router = express.Router();
const {
  getAllResources,
  getResourceById,
  getResourceAvailability,
  createResource,
  updateResource,
  deleteResource
} = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.get('/:id/availability', protect, getResourceAvailability);

// Admin resource management
router.post('/', protect, authorize('admin'), createResource);
router.put('/:id', protect, authorize('admin'), updateResource);
router.delete('/:id', protect, authorize('admin'), deleteResource);

module.exports = router;


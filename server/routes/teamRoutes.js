const express = require('express');
const router = express.Router();
const {
  createTeam,
  joinTeam,
  getMyTeams,
  submitProject,
  getEventTeams
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createTeam);
router.post('/join', joinTeam);
router.get('/my', getMyTeams);
router.post('/:id/submit', submitProject);
router.get('/event/:eventId', getEventTeams);

module.exports = router;

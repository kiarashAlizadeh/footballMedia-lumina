import express from 'express';
const router = express.Router();
import User from '../models/User.js';
import footballTeams from '../../constant/footballTeams.js';

// Getting one
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const team = footballTeams.find((team) => team.id === user.favoriteTeam);

    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

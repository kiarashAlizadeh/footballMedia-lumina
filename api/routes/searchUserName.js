import express from 'express';
const router = express.Router();
import User from '../models/User.js';

// Finding users
router.post('/', async (req, res) => {
  try {
    const { userName } = req.body;

    if (!userName) {
      // handel if data is empty
      return res.status(400).json({ message: 'please enter valid data' });
    }

    const users = await User.find({
      userName: { $regex: userName, $options: 'i' },
    });

    if (!users || users.length === 0) {
      return res.status(400).json({ message: 'no users found' });
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

import express from 'express';
const router = express.Router();
import User from '../models/User.js';

// Getting One
router.get('/:id', async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create an array to store follower details
    const followingDetails = [];

    // For each ID in the following list
    for (const followingId of user.followings) {
      // Find user with the specified ID
      const followingUser = await User.findOne({ _id: followingId });

      // Add user details to the array
      if (followingUser) {
        followingDetails.push({
          id: followingUser._id,
          name: followingUser.name,
          familyName: followingUser.familyName,
          userName: followingUser.userName,
        });
      }
    }

    // Send the details as a response
    res.json(followingDetails);
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: err.message });
  }
});

export default router;

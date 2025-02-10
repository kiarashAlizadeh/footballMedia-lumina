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
    const followerDetails = [];

    // For each ID in the followers list
    for (const followerId of user.followers) {
      // Find user with the specified ID
      const followerUser = await User.findOne({ _id: followerId });

      // Add user details to the array
      if (followerUser) {
        followerDetails.push({
          id: followerUser._id,
          name: followerUser.name,
          familyName: followerUser.familyName,
          userName: followerUser.userName,
        });
      }
    }

    // Send the details as a response
    res.json(followerDetails);
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: err.message });
  }
});

export default router;

import express from 'express';
const router = express.Router();
import Tweets from '../models/Tweets.js';

// Creating one
router.post('/', async (req, res) => {
  try {
    const { tweetId, commentIndex } = req.body;

    if (!tweetId || !commentIndex) {
      // handel if data is empty
      return res.status(400).json({ message: 'please enter valid data' });
    }
    const tweet = await Tweets.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    // Check if the commentIndex is valid
    if (commentIndex < 0 || commentIndex >= tweet.comments.length) {
      return res.status(400).json({ message: 'Invalid comment index' });
    }

    // Remove the comment at the specified index
    tweet.comments.splice(commentIndex, 1);

    // Save the tweet
    await tweet.save();

    return res.status(200).json({
      message: 'Comment deleted successfully',
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

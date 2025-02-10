import express from 'express';
const router = express.Router();
import Tweets from '../models/Tweets.js';

// Creating one
router.post('/', async (req, res) => {
  try {
    const { tweetId, userId } = req.body;

    if (!tweetId || !userId) {
      // handel if data is empty
      return res.status(400).json({ message: 'please enter valid data' });
    }

    const tweet = await Tweets.findById(tweetId);
    //check if like exist
    if (tweet.likes.includes(userId)) {
      tweet.likes = tweet.likes.filter((id) => id !== userId);
      await tweet.save();
      return res.status(201).json({ message: 'Like removed for tweet' });
    } else {
      tweet.likes.push(userId);
      await tweet.save();
      return res.status(201).json({ message: 'Like added for tweet' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

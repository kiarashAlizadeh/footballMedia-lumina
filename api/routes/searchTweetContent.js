import express from 'express';
const router = express.Router();
import Tweets from '../models/Tweets.js';

// Finding tweets
router.post('/', async (req, res) => {
  try {
    const { searchText } = req.body;

    if (!searchText) {
      return res
        .status(400)
        .json({ message: 'Please enter valid search text' });
    }

    const tweets = await Tweets.find({
      $or: [
        { tweetContent: { $regex: searchText, $options: 'i' } },
        { 'comments.commentContent': { $regex: searchText, $options: 'i' } },
      ],
    });

    if (!tweets || tweets.length === 0) {
      return res.status(400).json({ message: 'No tweet or comment found' });
    }

    res.status(200).json(tweets);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

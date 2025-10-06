import express from 'express';
const router = express.Router();
import User from '../models/User.js';

// follow
router.post('/', async (req, res) => {
  try {
    const { reqId, userId } = req.body;
    if (!reqId || !userId) {
      // handel if data is empty
      return res.status(400).json({ message: "Id's are invalid" });
    }

    if (reqId === userId) {
      return res.status(400).json({ message: 'you can not unFollow yourself' });
    }

    const user = await User.findOne({ _id: userId });
    const reqUser = await User.findOne({ _id: reqId });
    if (user.followings.includes(reqId)) {
      // If already following, send a message indicating that
      return res.status(400).json({
        message: `You are already following user with ID: ${reqId}`,
      });
    } // If not, add it to the followers array
    user.followings.push(req.body.reqId);
    reqUser.followers.push(req.body.userId);
    const updatedUser = await user.save();
    const updatedReqUser = await reqUser.save();

    res.status(200).json({ message: 'Following set' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// unFollow
router.delete('/', async (req, res) => {
  try {
    const { reqId, userId } = req.body;
    if (!reqId || !userId) {
      // handel if data is empty
      return res.status(400).json({ message: "Id's are invalid" });
    }
    if (reqId === userId) {
      return res.status(400).json({ message: 'you can not unFollow yourself' });
    }

    const user = await User.findOne({ _id: userId });
    const reqUser = await User.findOne({ _id: reqId });
    if (!user.followings.includes(reqId)) {
      return res.status(400).json({
        message: `You have not follow user with ID: ${reqId}`,
      });
    }
    user.followings = user.followings.filter((id) => id !== req.body.reqId);
    reqUser.followers = reqUser.followers.filter(
      (id) => id !== req.body.userId
    );

    const updatedUser = await user.save();
    const updatedReqUser = await reqUser.save();

    res.status(200).json({ message: 'unFollowing set' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

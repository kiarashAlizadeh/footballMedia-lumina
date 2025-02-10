import mongoose from 'mongoose';

const twitsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userNameAndFamilyName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  tweetContent: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
    default: [],
  },
  comments: [
    {
      userId: {
        type: String,
        required: true,
      },
      userNameAndFamilyName: {
        type: String,
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
      commentContent: {
        type: String,
        required: true,
      },
      likes: {
        type: Array,
        default: [],
      },
      dateTime: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
});

export default mongoose.model('Tweets', twitsSchema);

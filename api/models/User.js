import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  familyName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  birthDate: {
    type: String,
    required: true,
  },
  pass: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  favoriteTeam: {
    type: String,
    default: '',
  },
  followings: {
    type: Array,
    default: [],
  },
  followers: {
    type: Array,
    default: [],
  },
  predictions: {
    type: Array,
    default: [],
  },
  yourLink: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    default: 'USER',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },
});

export default mongoose.model('User', userSchema);

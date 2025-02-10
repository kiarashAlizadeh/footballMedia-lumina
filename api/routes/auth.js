import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import User from '../models/User.js';
import cookie from 'cookie';

// Getting all
router.get('/', async (req, res) => {
  try {
    const secretKey = process.env.SECRET_KEY;
    const authToken = req.cookies.token;

    const result = jsonwebtoken.verify(authToken, secretKey);
    const user = await User.findOne({ email: result.email });

    const authUser = {
      name: user.name,
      role: user.role,
      userId: user._id,
    };

    res.json(authUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// authenticating
router.post('/', async (req, res) => {
  try {
    const { email, pass } = req.body;
    const secretKey = process.env.SECRET_KEY;
    const expiration = 24 * 60 * 60 * 1000;

    if (!email || !pass) {
      // handel if data is empty
      return res.status(400).json({ message: 'please enter valid data' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'user not found' });
    }

    const isValid = await bcrypt.compare(pass, user.pass);
    if (!isValid) {
      return res
        .status(400)
        .json({ message: 'username or password is incorrect' });
    }

    const token = jsonwebtoken.sign({ email, role: user.role }, secretKey, {
      expiresIn: expiration,
    });
    res
      .status(200)
      .setHeader(
        'Set-Cookie',
        cookie.serialize('token', token, {
          httpOnly: true,
          maxAge: expiration,
          path: '/',
          sameSite: 'none',
          secure: true,
        })
      )

      .json({ message: 'Logged in !', data: { email: user.email, token } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

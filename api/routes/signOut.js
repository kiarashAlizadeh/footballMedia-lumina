import express from 'express';
const router = express.Router();
import cookie from 'cookie';

// kill cookie
router.get('/', async (req, res) => {
  try {
    res
      .status(200)
      .setHeader(
        'Set-Cookie',
        cookie.serialize('token', '', {
          httpOnly: true,
          maxAge: 0,
          path: '/',
          sameSite: 'none',
          secure: true,
        })
      )
      .json({ message: 'Logged Out!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

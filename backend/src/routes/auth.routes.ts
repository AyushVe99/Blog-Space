import express from 'express';
import { loginUser, registerUser, refreshToken, getMe } from '../controllers/auth.controller';

import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);

export default router;

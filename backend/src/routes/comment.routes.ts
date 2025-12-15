import express from 'express';
import { likeComment, unlikeComment } from '../controllers/comment.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/:id/like', protect, likeComment);
router.delete('/:id/like', protect, unlikeComment);

export default router;

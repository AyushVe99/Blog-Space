import express from 'express';
import { getBlogs, getBlogById, createBlog, likeBlog, unlikeBlog } from '../controllers/blog.controller';
import { getCommentsByBlogId, addComment } from '../controllers/comment.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.post('/', protect, createBlog);
router.post('/:id/like', protect, likeBlog);
router.delete('/:id/like', protect, unlikeBlog);

// Comment routes
router.get('/:id/comments', getCommentsByBlogId);
router.post('/:id/comments', protect, addComment);

export default router;

import { Request, Response } from 'express';
import Comment from '../models/Comment';
import Blog from '../models/Blog';

interface AuthRequest extends Request {
    user?: any;
}

// @desc    Get comments for a blog
// @route   GET /api/blogs/:id/comments
// @access  Public
export const getCommentsByBlogId = async (req: Request, res: Response) => {
    try {
        const comments = await Comment.find({ blog: req.params.id })
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a comment to a blog
// @route   POST /api/blogs/:id/comments
// @access  Private
export const addComment = async (req: AuthRequest, res: Response) => {
    try {
        const { content } = req.body;
        const blogId = req.params.id;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const comment = await Comment.create({
            content,
            blog: blogId,
            author: req.user._id,
        });

        // Add comment to blog's comments array
        blog.comments.push(comment._id as any);
        await blog.save();

        const populatedComment = await Comment.findById(comment._id).populate('author', 'name avatar');

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Like a comment
// @route   POST /api/comments/:id/like
// @access  Private
export const likeComment = async (req: AuthRequest, res: Response) => {
    try {
        const commentId = req.params.id;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.likes.includes(userId)) {
            return res.status(400).json({ message: 'Comment already liked' });
        }

        comment.likes.push(userId);
        await comment.save();

        res.json(comment.likes);
    } catch (error) {
        console.error('Error liking comment:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Unlike a comment
// @route   DELETE /api/comments/:id/like
// @access  Private
export const unlikeComment = async (req: AuthRequest, res: Response) => {
    try {
        const commentId = req.params.id;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Remove user from likes
        comment.likes = comment.likes.filter((id) => id.toString() !== userId.toString());
        await comment.save();

        res.json(comment.likes);
    } catch (error) {
        console.error('Error unliking comment:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

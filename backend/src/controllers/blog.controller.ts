import { Request, Response } from 'express';
import Blog from '../models/Blog';

interface AuthRequest extends Request {
    user?: any;
}

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req: Request, res: Response) => {
    try {
        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword as string,
                    $options: 'i',
                },
            }
            : {};

        const categoryFilter = req.query.category ? { category: req.query.category as string } : {};

        const blogs = await Blog.find({ status: 'published', ...keyword, ...categoryFilter })
            .populate('author', 'name avatar')
            .populate('category', 'name')
            .sort({ createdAt: -1 }); // Newest first
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = async (req: Request, res: Response) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'name avatar bio')
            .populate('category', 'name');

        if (blog) {
            // Increment views
            blog.views = (blog.views || 0) + 1;
            await blog.save();
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private/Author
export const createBlog = async (req: AuthRequest, res: Response) => {
    try {
        const { title, content, image, tags, category, status } = req.body;

        // Generate slug from title
        const slugify = require('slugify');
        let slug = slugify(title, { lower: true, strict: true });

        // Check if slug already exists and append random string if so
        let slugExists = await Blog.findOne({ slug });
        if (slugExists) {
            slug = `${slug}-${Date.now()}`;
        }

        const blog = new Blog({
            title,
            slug,
            content,
            image,
            tags,
            category,
            status,
            author: req.user._id,
        });

        const createdBlog = await blog.save();
        res.status(201).json(createdBlog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Like a blog
// @route   POST /api/blogs/:id/like
// @access  Private
export const likeBlog = async (req: AuthRequest, res: Response) => {
    try {
        const blogId = req.params.id;
        const userId = req.user._id;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.likes.includes(userId)) {
            return res.status(400).json({ message: 'Blog already liked' });
        }

        blog.likes.push(userId);
        await blog.save();

        res.json(blog.likes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Unlike a blog
// @route   DELETE /api/blogs/:id/like
// @access  Private
export const unlikeBlog = async (req: AuthRequest, res: Response) => {
    try {
        const blogId = req.params.id;
        const userId = req.user._id;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.likes = blog.likes.filter((id) => id.toString() !== userId.toString());
        await blog.save();

        res.json(blog.likes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

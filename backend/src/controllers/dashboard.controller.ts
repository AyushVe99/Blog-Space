import { Request, Response } from 'express';
import Blog from '../models/Blog';
import User from '../models/User';

interface AuthRequest extends Request {
    user?: any;
}

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;

        const totalBlogs = await Blog.countDocuments({ author: userId });

        // Aggregation to count total views for the user's blogs
        const viewsAggregation = await Blog.aggregate([
            { $match: { author: userId } },
            { $group: { _id: null, totalViews: { $sum: '$views' } } },
        ]);
        const totalViews = viewsAggregation.length > 0 ? viewsAggregation[0].totalViews : 0;

        // Placeholder for followers (if we implement following later)
        const followersCount = 0;

        const recentBlogs = await Blog.find({ author: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title createdAt status views');

        res.json({
            totalBlogs,
            totalViews,
            followersCount,
            recentBlogs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

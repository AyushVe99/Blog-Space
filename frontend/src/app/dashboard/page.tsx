'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Link from 'next/link';
import axios from 'axios';
import { format } from 'date-fns';

// Define interface for stats
interface DashboardStats {
    totalBlogs: number;
    totalViews: number;
    followersCount: number;
    recentBlogs: Array<{
        _id: string;
        title: string;
        createdAt: string;
        status: string;
        views: number;
    }>;
}

export default function DashboardPage() {
    const router = useRouter();
    const { user, token } = useSelector((state: RootState) => state.auth);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            router.push('/login');
        } else {
            const fetchStats = async () => {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    };
                    const { data } = await axios.get('http://localhost:5000/api/dashboard/stats', config);
                    setStats(data);
                } catch (error) {
                    console.error('Error fetching dashboard stats:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchStats();
        }
    }, [token, router]);

    if (!user) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">Welcome back, {user.name}!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
                    <div className="space-y-4">
                        <Link
                            href="/blogs/create"
                            className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                        >
                            Write a New Blog
                        </Link>
                        <Link
                            href="/profile"
                            className="block w-full text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-2 px-4 rounded transition duration-300"
                        >
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* Stats Placeholder */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Your Stats</h2>
                    {loading ? (
                        <p className="text-gray-600 dark:text-gray-400">Loading stats...</p>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Total Blogs</span>
                                <span className="font-bold text-gray-900 dark:text-white">{stats?.totalBlogs || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Total Views</span>
                                <span className="font-bold text-gray-900 dark:text-white">{stats?.totalViews || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Followers</span>
                                <span className="font-bold text-gray-900 dark:text-white">{stats?.followersCount || 0}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent Activity Placeholder */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity</h2>
                    {loading ? (
                        <p className="text-gray-600 dark:text-gray-400">Loading activity...</p>
                    ) : stats?.recentBlogs && stats.recentBlogs.length > 0 ? (
                        <div className="space-y-4">
                            {stats.recentBlogs.map((blog) => (
                                <div key={blog._id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-2 last:pb-0">
                                    <Link href={`/blogs/${blog._id}`} className="block hover:underline">
                                        <h3 className="text-md font-medium text-gray-900 dark:text-white truncate">{blog.title}</h3>
                                    </Link>
                                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        <span>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs ${blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {blog.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">No recent activity to show.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

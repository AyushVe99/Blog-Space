import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Heart, MessageCircle } from 'lucide-react';
import { Card } from '../ui/Card';

interface BlogCardProps {
    blog: {
        _id: string;
        title: string;
        slug: string;
        excerpt: string;
        author: {
            name: string;
            avatar?: string;
        };
        category: {
            name: string;
            slug: string;
        };
        createdAt: string;
        readingTime?: number;
        likes: string[];
        comments: string[];
        image?: string;
    };
}

export const BlogCard = ({ blog }: BlogCardProps) => {
    return (
        <Link href={`/blogs/${blog._id}`}>
            <Card className="group h-full cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl">
                {blog.image && (
                    <div className="relative h-48 w-full overflow-hidden">
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-primary-700 backdrop-blur-sm dark:bg-black/70 dark:text-white">
                                {blog.category.name}
                            </span>
                        </div>
                    </div>
                )}
                <div className="p-6">
                    {!blog.image && (
                        <div className="mb-4">
                            <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                                {blog.category.name}
                            </span>
                        </div>
                    )}
                    <h3 className="mb-2 text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                        {blog.title}
                    </h3>
                    <p className="mb-4 text-gray-600 line-clamp-3 dark:text-gray-300">
                        {blog.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                                {blog.author.avatar ? (
                                    <img src={blog.author.avatar} alt={blog.author.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-primary-100 text-xs font-bold text-primary-700">
                                        {blog.author.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="text-sm">
                                <p className="font-medium text-gray-900 dark:text-white">{blog.author.name}</p>
                                <p className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{blog.readingTime || 5} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                <span>{blog.likes.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
};

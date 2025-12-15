'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { Clock, Heart, Calendar, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { CommentSection } from '@/components/comments/CommentSection';
import api from '@/lib/api.client';

export default function BlogDetailPage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const params = useParams();
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await api.get(`/blogs/${params.id}`);
                setBlog(data);
            } catch (error) {
                setError('Failed to load blog post');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchBlog();
        }
    }, [params.id]);

    const likeBlog = async () => {
        try {
            const { data } = await api.post(`/blogs/${params.id}/like`);
            setBlog({ ...blog, likes: data });
        } catch (error) {
            // If already liked (400), try unliking
            if ((error as any).response?.status === 400) {
                try {
                    const { data } = await api.delete(`/blogs/${params.id}/like`);
                    setBlog({ ...blog, likes: data });
                } catch (unlikeError) {
                    setError('Failed to update like');
                }
            } else {
                setError('Failed to like blog');
            }
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-4xl space-y-8">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-96 w-full" />
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="flex h-64 items-center justify-center text-red-500">
                {error || 'Blog not found'}
            </div>
        );
    }

    return (
        <article className="mx-auto max-w-4xl">
            {/* Header */}
            <header className="mb-8 space-y-6 text-center">
                <div className="flex justify-center">
                    <span className="rounded-full bg-primary-100 px-4 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                        {blog.category.name}
                    </span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                    {blog.title}
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                            {blog.author.avatar ? (
                                <img src={blog.author.avatar} alt={blog.author.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-primary-100 text-sm font-bold text-primary-700">
                                    {blog.author.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{blog.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{blog.readingTime || 5} min read</span>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            {blog.image && (
                <div className="mb-12 overflow-hidden rounded-2xl shadow-lg">
                    <img src={blog.image} alt={blog.title} className="h-full w-full object-cover" />
                </div>
            )}

            {/* Content */}
            <div className="prose prose-lg prose-primary mx-auto dark:prose-invert">
                <ReactMarkdown>{blog.content}</ReactMarkdown>
            </div>

            {/* Tags */}
            <div className="mt-12 flex flex-wrap gap-2">
                {blog.tags.map((tag: string) => (
                    <span
                        key={tag}
                        className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Engagement */}
            <div className="mt-12 border-t border-gray-200 py-8 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                        <Button variant="outline" className="gap-2" onClick={likeBlog}>
                            <Heart className={`h-4 w-4 ${blog.likes.includes(user?._id) ? 'fill-red-500 text-red-500' : ''}`} />
                            {blog.likes.length} Likes
                        </Button>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <CommentSection blogId={blog._id} />
        </article>
    );
}

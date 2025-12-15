'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BlogCard } from '@/components/blog/BlogCard';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import api from '@/lib/api.client';

export default function CategoryDetailPage() {
    const params = useParams();
    const [category, setCategory] = useState<any>(null);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, blogsRes] = await Promise.all([
                    api.get(`/categories/${params.id}`),
                    api.get(`/blogs?category=${params.id}`),
                ]);
                setCategory(catRes.data);
                setBlogs(blogsRes.data);
            } catch (error) {
                console.error('Failed to fetch category data');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchData();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-12 w-1/3" />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-80 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="flex h-64 items-center justify-center text-red-500">
                Category not found
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">{category.name}</h1>
                <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                    {category.description}
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {blogs.length > 0 ? (
                    blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
                ) : (
                    <div className="col-span-full flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">No blogs found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

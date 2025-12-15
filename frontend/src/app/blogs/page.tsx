'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BlogCard } from '@/components/blog/BlogCard';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import api from '@/lib/api.client';

function BlogsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams();
                if (search) queryParams.append('search', search);
                if (category) queryParams.append('category', category);
                queryParams.append('page', page.toString());
                queryParams.append('limit', '9');

                const { data } = await api.get(`/blogs?${queryParams.toString()}`);
                setBlogs(data);
                // setTotalPages(data.pages); // Pagination not implemented in backend yet
            } catch (error) {
                console.error('Failed to fetch blogs');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [page, search, category]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        const params = new URLSearchParams(searchParams);
        if (search) params.set('search', search);
        else params.delete('search');
        router.push(`/blogs?${params.toString()}`);
    };

    const handleCategoryChange = (catId: string) => {
        setCategory(catId);
        setPage(1);
        const params = new URLSearchParams(searchParams);
        if (catId) params.set('category', catId);
        else params.delete('category');
        router.push(`/blogs?${params.toString()}`);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explore Blogs</h1>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        placeholder="Search blogs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<Search className="h-4 w-4" />}
                        className="w-full md:w-64"
                    />
                    <Button type="submit">Search</Button>
                </form>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row">
                {/* Filters Sidebar */}
                <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
                    <Card className="p-4">
                        <div className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                            <Filter className="h-4 w-4" />
                            Filters
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Categories</h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => handleCategoryChange('')}
                                    className={`block w-full rounded-md px-2 py-1 text-left text-sm ${!category
                                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    All Categories
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => handleCategoryChange(cat._id)}
                                        className={`block w-full rounded-md px-2 py-1 text-left text-sm ${category === cat._id
                                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Card>
                </aside>

                {/* Blog Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Card key={i} className="h-80 animate-pulse bg-gray-100 dark:bg-gray-800" />
                            ))}
                        </div>
                    ) : blogs.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {blogs.map((blog) => (
                                <BlogCard key={blog._id} blog={blog} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400">No blogs found matching your criteria.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            <Button
                                variant="outline"
                                disabled={page === 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                Previous
                            </Button>
                            <span className="flex items-center px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function BlogsPage() {
    return (
        <Suspense fallback={<div className="p-8"><Skeleton className="h-96 w-full" /></div>}>
            <BlogsContent />
        </Suspense>
    );
}

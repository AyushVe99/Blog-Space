'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import api from '@/lib/api.client';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explore Categories</h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                    <Link key={category._id} href={`/categories/${category._id}`}>
                        <Card className="group flex h-full flex-col justify-between p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                            <div>
                                <h2 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                                    {category.name}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {category.description || 'No description available'}
                                </p>
                            </div>
                            <div className="mt-4 text-sm font-medium text-primary-600 dark:text-primary-400">
                                View all posts &rarr;
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

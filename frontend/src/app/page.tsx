'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BlogCard } from '@/components/blog/BlogCard';
import api from '@/lib/api.client';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, blogsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/blogs')
        ]);

        setCategories(categoriesRes.data.slice(0, 4));
        setBlogs(blogsRes.data.slice(0, 6)); // Show latest 6 blogs
      } catch (error) {
        console.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 px-6 py-24 text-center text-white shadow-2xl sm:px-12 md:py-32">
        <div className="relative z-10 mx-auto max-w-4xl space-y-6">
          <h1 className="animate-fade-in text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Discover Stories That <span className="text-secondary-400">Matter</span>
          </h1>
          <p className="animate-slide-up mx-auto max-w-2xl text-lg text-primary-100 sm:text-xl">
            A community of writers, thinkers, and creators sharing their unique perspectives on technology, lifestyle, and more.
          </p>
          <div className="animate-slide-up flex justify-center gap-4 pt-4">
            <Link href="/blogs">
              <Button size="lg" className="bg-white text-primary-900 hover:bg-gray-100">
                Start Reading
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Join Community
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-secondary-500/20 blur-3xl" />
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl" />
      </section>

      {/* Featured Categories */}
      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Categories</h2>
          <Link href="/categories" className="flex items-center text-primary-600 hover:text-primary-700">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
          ) : (
            categories.map((category) => (
              <Link key={category._id} href={`/categories/${category._id}`}>
                <Card variant="glass" className="group cursor-pointer p-6 hover:scale-105 h-full flex flex-col justify-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Explore latest stories</p>
                </Card>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Latest Posts Preview */}
      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Posts</h2>
          <Link href="/blogs" className="flex items-center text-primary-600 hover:text-primary-700">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            [1, 2, 3].map((i) => (
              <Card key={i} className="flex flex-col h-full">
                <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </Card>
            ))
          ) : (
            blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}


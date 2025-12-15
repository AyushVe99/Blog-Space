'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Save, Send, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { RootState } from '@/store/store';
import api from '@/lib/api.client';

export default function CreateBlogPage() {
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

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

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const blogData = {
                ...data,
                content,
                tags: data.tags.split(',').map((tag: string) => tag.trim()),
                status: 'published', // Or draft based on button clicked
            };

            await api.post('/blogs', blogData);
            router.push('/dashboard');
        } catch (error) {
            console.error('Failed to create blog', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user || (user.role !== 'author' && user.role !== 'admin')) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-lg text-gray-500">You are not authorized to access this page.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Write a New Story</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                    <Input
                        placeholder="Enter your title..."
                        className="text-4xl font-bold border-none px-0 shadow-none focus:ring-0 placeholder:text-gray-300"
                        {...register('title', { required: 'Title is required' })}
                    />
                    {errors.title && <p className="text-red-500">{errors.title.message as string}</p>}

                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                Category
                            </label>
                            <select
                                className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                {...register('category', { required: 'Category is required' })}
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message as string}</p>}
                        </div>

                        <Input
                            label="Tags (comma separated)"
                            placeholder="technology, coding, web"
                            {...register('tags')}
                        />
                    </div>

                    <Input
                        label="Cover Image URL"
                        placeholder="https://example.com/image.jpg"
                        icon={<ImageIcon className="h-5 w-5" />}
                        {...register('image')}
                    />

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Content
                        </label>
                        <MarkdownEditor value={content} onChange={setContent} placeholder="Tell your story..." />
                    </div>
                </div>

                <div className="flex justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
                    <Button type="button" variant="ghost">
                        <Save className="mr-2 h-4 w-4" />
                        Save as Draft
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        <Send className="mr-2 h-4 w-4" />
                        Publish
                    </Button>
                </div>
            </form>
        </div>
    );
}

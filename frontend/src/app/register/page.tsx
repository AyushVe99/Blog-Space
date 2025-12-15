'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { UserPlus, User, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { setCredentials } from '@/store/slices/authSlice';
import api from '@/lib/api.client';

export default function RegisterPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const password = watch('password');

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/register', {
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role,
            });
            dispatch(setCredentials({ user: response.data, token: response.data.token }));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
            <Card className="w-full max-w-md p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                        <UserPlus className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create an account</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Join our community of writers and readers
                    </p>
                </div>

                {error && (
                    <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Full Name"
                        placeholder="Ayush Verma"
                        icon={<User className="h-5 w-5" />}
                        error={errors.name?.message as string}
                        {...register('name', { required: 'Name is required' })}
                    />

                    <Input
                        label="Email address"
                        type="email"
                        placeholder="you@example.com"
                        icon={<Mail className="h-5 w-5" />}
                        error={errors.email?.message as string}
                        {...register('email', { required: 'Email is required' })}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock className="h-5 w-5" />}
                        error={errors.password?.message as string}
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Password must be at least 6 characters' }
                        })}
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock className="h-5 w-5" />}
                        error={errors.confirmPassword?.message as string}
                        {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: (val: string) => val === password || 'Passwords do not match',
                        })}
                    />

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                            I want to join as a
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="cursor-pointer">
                                <input
                                    type="radio"
                                    value="reader"
                                    className="peer sr-only"
                                    {...register('role')}
                                    defaultChecked
                                />
                                <div className="rounded-lg border border-gray-200 p-4 text-center hover:bg-gray-50 peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700 dark:border-gray-700 dark:hover:bg-gray-800 dark:peer-checked:bg-primary-900/20">
                                    Reader
                                </div>
                            </label>
                            <label className="cursor-pointer">
                                <input
                                    type="radio"
                                    value="author"
                                    className="peer sr-only"
                                    {...register('role')}
                                />
                                <div className="rounded-lg border border-gray-200 p-4 text-center hover:bg-gray-50 peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700 dark:border-gray-700 dark:hover:bg-gray-800 dark:peer-checked:bg-primary-900/20">
                                    Author
                                </div>
                            </label>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Create account
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                        Sign in
                    </Link>
                </p>
            </Card>
        </div>
    );
}

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated && !user) {
            router.push('/login');
        }
    }, [isAuthenticated, user, router]);

    if (!user) {
        return null; // Or a loading spinner
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Card */}
                <Card className="md:col-span-1 border-0 shadow-lg bg-white dark:bg-gray-800">
                    <div className="flex flex-col items-center p-6 text-center">
                        <div className="mb-4 h-32 w-32 overflow-hidden rounded-full bg-primary-100 ring-4 ring-white dark:ring-gray-700">
                            <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-primary-700">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <h2 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                        <span className="mb-4 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 capitalize">
                            {user.role}
                        </span>
                    </div>
                </Card>

                {/* Details Card */}
                <Card className="md:col-span-2 border-0 shadow-lg bg-white dark:bg-gray-800">
                    <div className="p-6">
                        <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Account Details</h3>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 rounded-lg border border-gray-100 p-4 dark:border-gray-700">
                                <div className="flex h-10 w-10 min-w-[2.5rem] items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <User className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                                    <p className="font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-lg border border-gray-100 p-4 dark:border-gray-700">
                                <div className="flex h-10 w-10 min-w-[2.5rem] items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                                    <p className="font-medium text-gray-900 dark:text-white truncate">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-lg border border-gray-100 p-4 dark:border-gray-700">
                                <div className="flex h-10 w-10 min-w-[2.5rem] items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Role</p>
                                    <p className="font-medium text-gray-900 dark:text-white capitalize">{user.role}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <Button variant="outline" className="mr-2">Edit Profile</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

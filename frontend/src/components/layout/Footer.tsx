import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between md:flex-row">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            BlogSpace
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            © {new Date().getFullYear()} All rights reserved.
                        </p>
                    </div>
                    <div className="mt-4 flex space-x-6 md:mt-0">
                        <Link href="https://github.com/Ayush30012000" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                            <span className="sr-only">GitHub</span>
                            <Github className="h-6 w-6" />
                        </Link>
                        {/* Twitter link removed or kept as placeholder if preferred */}

                        <Link href="https://www.linkedin.com/in/ayush-verma-08b125227/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                            <span className="sr-only">LinkedIn</span>
                            <Linkedin className="h-6 w-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

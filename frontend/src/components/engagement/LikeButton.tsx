'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../ui/Button';
import api from '@/lib/api.client';

interface LikeButtonProps {
    initialLikes: number;
    initialLiked: boolean;
    targetId: string;
    type: 'blog' | 'comment';
    className?: string;
}

export const LikeButton = ({
    initialLikes,
    initialLiked,
    targetId,
    type,
    className,
}: LikeButtonProps) => {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(initialLiked);
    const [isLoading, setIsLoading] = useState(false);

    const handleLike = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const previousLikes = likes;
        const previousLiked = liked;

        // Optimistic update
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);

        try {
            const endpoint = type === 'blog' ? `/blogs/${targetId}/like` : `/comments/${targetId}/like`;

            if (liked) {
                await api.delete(endpoint);
            } else {
                await api.post(endpoint);
            }
        } catch (error) {
            // Revert on error
            setLiked(previousLiked);
            setLikes(previousLikes);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn(
                'gap-2 transition-colors',
                liked ? 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-gray-500 hover:text-gray-700',
                className
            )}
            disabled={isLoading}
        >
            <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
            <span>{likes}</span>
        </Button>
    );
};

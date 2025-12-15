'use client';

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Trash2, Edit2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LikeButton } from '../engagement/LikeButton';
import { RootState } from '@/store/store';
import api from '@/lib/api.client';

interface CommentProps {
    comment: any;
    onReply: (commentId: string) => void;
    onDelete: (commentId: string) => void;
    depth?: number;
}

export const CommentItem = ({ comment, onReply, onDelete, depth = 0 }: CommentProps) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(comment.content);

    const handleUpdate = async () => {
        try {
            await api.put(`/comments/${comment._id}`, { content });
            setIsEditing(false);
            comment.content = content; // Optimistic update
        } catch (error) {
            console.error('Failed to update comment');
        }
    };

    return (
        <div className={`space-y-4 ${depth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4 dark:border-gray-800' : ''}`}>
            <div className="flex gap-4">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                    {comment.author.avatar ? (
                        <img src={comment.author.avatar} alt={comment.author.name} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary-100 text-sm font-bold text-primary-700">
                            {comment.author.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="font-medium text-gray-900 dark:text-white">{comment.author.name}</span>
                            <span className="ml-2 text-xs text-gray-500">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        {user && (user._id === comment.author._id || user.role === 'admin') && (
                            <div className="flex gap-2">
                                {user._id === comment.author._id && (
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="text-gray-400 hover:text-primary-600"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => onDelete(comment._id)}
                                    className="text-gray-400 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-2">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                                rows={3}
                            />
                            <div className="flex justify-end gap-2">
                                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                                <Button size="sm" onClick={handleUpdate}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700 dark:text-gray-300">{content}</p>
                    )}

                    <div className="flex items-center gap-4">
                        <LikeButton
                            initialLikes={comment.likes?.length || 0}
                            initialLiked={user ? comment.likes?.includes(user._id) : false}
                            targetId={comment._id}
                            type="comment"
                        />
                        {depth < 2 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-gray-500 hover:text-gray-700"
                                onClick={() => onReply(comment._id)}
                            >
                                <MessageCircle className="h-4 w-4" />
                                Reply
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {comment.replies?.map((reply: any) => (
                <CommentItem
                    key={reply._id}
                    comment={reply}
                    onReply={onReply}
                    onDelete={onDelete}
                    depth={depth + 1}
                />
            ))}
        </div>
    );
};

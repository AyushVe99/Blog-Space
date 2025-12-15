'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CommentItem } from './CommentItem';
import { RootState } from '@/store/store';
import api from '@/lib/api.client';

interface CommentSectionProps {
    blogId: string;
}

export const CommentSection = ({ blogId }: CommentSectionProps) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [blogId]);

    const fetchComments = async () => {
        try {
            const { data } = await api.get(`/blogs/${blogId}/comments`);
            setComments(data);
        } catch (error) {
            console.error('Failed to fetch comments');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsLoading(true);
        try {
            const payload = {
                content: newComment,
                // parentCommentId: replyTo, // Backend doesn't support nested comments yet
            };

            await api.post(`/blogs/${blogId}/comments`, payload);
            setNewComment('');
            setReplyTo(null);
            fetchComments(); // Refresh comments
        } catch (error) {
            console.error('Failed to post comment');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;
        try {
            await api.delete(`/comments/${commentId}`);
            fetchComments();
        } catch (error) {
            console.error('Failed to delete comment');
        }
    };

    return (
        <div className="mt-12">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
                <MessageCircle className="h-6 w-6" />
                Comments ({comments?.length || 0})
            </h2>

            {user ? (
                <Card className="mb-8 p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                {replyTo ? 'Replying to comment...' : 'Leave a comment'}
                            </label>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 p-3 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                                rows={3}
                                placeholder="Share your thoughts..."
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            {replyTo && (
                                <Button type="button" variant="ghost" onClick={() => setReplyTo(null)}>
                                    Cancel Reply
                                </Button>
                            )}
                            <Button type="submit" isLoading={isLoading} disabled={!newComment.trim()}>
                                <Send className="mr-2 h-4 w-4" />
                                Post Comment
                            </Button>
                        </div>
                    </form>
                </Card>
            ) : (
                <Card className="mb-8 p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        Please <a href="/login" className="text-primary-600 hover:underline">log in</a> to leave a comment.
                    </p>
                </Card>
            )}

            <div className="space-y-6">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment._id}
                        comment={comment}
                        onReply={(id) => setReplyTo(id)}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};

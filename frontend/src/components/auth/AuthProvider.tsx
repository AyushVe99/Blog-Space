'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import api from '@/lib/api.client';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Verify token and get user data
                    const { data } = await api.get('/auth/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    dispatch(setCredentials({ user: data, token }));
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
        };

        checkAuth();
    }, [dispatch]);

    return <>{children}</>;
};

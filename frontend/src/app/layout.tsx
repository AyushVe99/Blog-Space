'use client';

import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Layout } from '@/components/layout/Layout';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <AuthProvider>
            <Layout>{children}</Layout>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}

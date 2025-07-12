'use client'

import { Code, History, Home } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Navbar } from './Navbar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoggedIn = !!session;
  

  const handleLogin = () => {
    signIn();
    router.push('/auth/signin');
  };

  const handleLogout = () => {
    signOut();
  };

  const menuItems = isLoggedIn ? [
    {
      label: 'Chat',
      icon: <Home size={16} />,
      onClick: () => router.push('/chat')
    },
    {
      label: 'History',
      icon: <History size={16} />,
      onClick: () => router.push('/history')
    },
  ] : [];



  const logo = (
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-sm">
        <Code className="w-6 h-6 text-white" />
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        CodeAI
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar
        logo={logo}
        menuItems={menuItems}
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}; 
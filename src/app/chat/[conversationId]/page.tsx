'use client'

import { ChatInterface } from '@/components/ChatInterface';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';

interface ConversationPageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default function ConversationPage({ params }: ConversationPageProps) {
  const { conversationId } = use(params);
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('message') || '';

  return (
    <ProtectedRoute>
      <div className="bg-white text-black">
        <ChatInterface 
          initialMessage={initialMessage} 
          conversationId={conversationId}
        />
      </div>
    </ProtectedRoute>
  );
} 
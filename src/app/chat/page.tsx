'use client'

import { StartingPage } from '@/components/StartPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';

// Main App Component
export default function CodeAIApp() {
  const router = useRouter();

  const handleStartConversation = (message: string) => {
    
    const conversationId = Date.now().toString();
    
    router.push(`/chat/${conversationId}?message=${encodeURIComponent(message)}`);
  };

  return (
    <ProtectedRoute>
      <div className="bg-white text-black">
        <StartingPage onStartConversation={handleStartConversation} />
      </div>
    </ProtectedRoute>
  );
}
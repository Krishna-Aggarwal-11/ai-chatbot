"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2, Search, MessageSquare, Calendar, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface Message {
  id: number;
  prompt: string;
  response: string;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export default function HistoryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchMessages = async (page = 1, search = "") => {
    if (!session?.user) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      });

      const response = await fetch(`/api/messages?${params}`);
      const data = await response.json();

      if (data.success) {
        setMessages(data.messages);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Memoize fetchMessages to prevent infinite re-renders
  const memoizedFetchMessages = useCallback(fetchMessages, [session?.user]);

  useEffect(() => {
    if (session?.user) {
      memoizedFetchMessages();
    }
  }, [session, memoizedFetchMessages]);

  const handleSearch = () => {
    memoizedFetchMessages(1, searchTerm);
  };

  const handleDelete = async (messageId: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    setDeletingId(messageId);
    try {
      const response = await fetch(`/api/messages?id=${messageId}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Your Conversations</h1>
          <p className="text-gray-500">
            Review your previous prompts
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search your messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={loading}
            variant="outline"
            className="border-gray-300"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </div>

        {/* Messages List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : messages.length === 0 ? (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-10 w-10 text-gray-400 mb-4" />
                <p className="text-gray-500 text-center">
                  {searchTerm ? "No messages found matching your search." : "No messages yet."}
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => router.push("/chat")} 
                    className="mt-4"
                    variant="outline"
                  >
                    Start a conversation
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            messages.map((message) => (
              <Card 
                key={message.id} 
                className="bg-white border-gray-200 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md"
              >
                <CardHeader className="pb-2 px-4 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(message.createdAt)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(message.id)}
                      disabled={deletingId === message.id}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-0"
                    >
                      {deletingId === message.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-3">
                  <div className="text-gray-800">
                    {message.prompt}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchMessages(pagination.page - 1, searchTerm)}
                disabled={pagination.page <= 1 || loading}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchMessages(pagination.page + 1, searchTerm)}
                disabled={!pagination.hasMore || loading}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}
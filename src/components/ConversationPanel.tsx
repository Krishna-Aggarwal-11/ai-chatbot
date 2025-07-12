import { MessageSquare, Send, User, Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
  timestamp: string;
  isCode?: boolean;
  explanation?: string;
}

interface ConversationPanelProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export function ConversationPanel({
  messages,
  isLoading,
  onSendMessage,
}: ConversationPanelProps) {
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      onSendMessage(currentMessage.trim());
      setCurrentMessage("");
    }
  };

  const cleanMessageContent = (content: string) => {
    let cleaned = content.replace(/```[\s\S]*?```/g, "");

    cleaned = cleaned.replace(/<[^>]*>/g, "");

    return cleaned.trim();
  };

  
  return (
    <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col relative">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <MessageSquare className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg">Start a conversation to begin coding!</p>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  message.type === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {message.type === "user" ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[calc(100%-60px)] ${
                  message.type === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                } rounded-xl p-4 shadow-sm`}
              >
                {message.type === "user" ? (
                
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {message.isCode && (
                      <div className="mb-3">
                        <div className="text-sm font-medium text-green-600 mb-2">
                          ✨ Code Generated Successfully
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <span className="text-gray-500 text-sm">
                            [Code displayed in the panel on the right]
                          </span>
                        </div>
                      </div>
                    )}

                    {message.explanation && (
                      <div className="">
                        <ReactMarkdown>{message.explanation}</ReactMarkdown>
                      </div>
                    )}

                    {!message.explanation && !message.isCode && (
                      <div className="whitespace-pre-wrap break-words">
                        <ReactMarkdown
                         
                        >
                          {cleanMessageContent(message.content)}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                )}

                <div
                  className={`text-xs mt-3 ${
                    message.type === "user" ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <Bot className="w-5 h-5 text-gray-700" />
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm max-w-[calc(100%-60px)]">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    Generating response...
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-6 border-t border-gray-200 bg-white"
      >
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Ask me to generate HTML/CSS code..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!currentMessage.trim() || isLoading}
            className="px-5 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

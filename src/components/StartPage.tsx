import { Code, Eye, Palette, Send, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface StartPageProps {
  onStartConversation: (message: string) => void;
}

export function StartingPage({ onStartConversation }: StartPageProps) {
  const [message, setMessage] = useState("");
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      onStartConversation(message.trim());
    }
  };

  const suggestions = [
    "Design a modern SaaS landing page with dark mode",
    "E-commerce product page with image gallery",
    "Responsive blog with dark mode and search",
    "Portfolio website with animations",
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#00000010_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
      
      <div
        className={`max-w-4xl w-full relative z-10 transition-all duration-1000 ${
          isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-black rounded-xl shadow-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-black">
              Code Generator
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Describe your design and get clean HTML/CSS code instantly
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-black mb-6 text-center">
            What would you like to build?
          </h2>

          {/* Quick suggestions */}
          <div className="mb-8">
            <p className="text-gray-500 mb-3 text-center text-sm">Try these:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setMessage(suggestion)}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-all duration-150 border border-gray-200 text-gray-700 hover:text-black hover:border-gray-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Example: 'Create a responsive navbar with dark mode toggle...'"
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-base"
                autoFocus
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="absolute bottom-3 right-3 p-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>


      </div>
    </div>
  );
}
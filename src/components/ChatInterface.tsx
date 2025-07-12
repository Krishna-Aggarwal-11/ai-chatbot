import { useEffect, useState, useRef } from "react";
import { ConversationPanel } from "./ConversationPanel";
import { CodePanel } from "./CodePanel";
import { useChat } from "@ai-sdk/react";


interface ChatInterfaceProps {
  initialMessage?: string;
  conversationId?: string;
}

interface ConvertedMessage {
  id: number;
  type: "user" | "ai";
  content: string;
  timestamp: string;
  isCode?: boolean;
  explanation?: string;
}

export function ChatInterface({ initialMessage, conversationId }: ChatInterfaceProps) {
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("html");
  const [messageContents, setMessageContents] = useState<{[key: number]: {content: string, explanation?: string}}>({});
  const initialMessageSentRef = useRef(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const {
    messages,
    isLoading,
    append,
  } = useChat({
    api: "/api/chat",
    id: conversationId,
    initialMessages: [],
    onError: (error) => {
      console.error("Chat error:", error);
    },
    onFinish: (message) => {
      const content = message.content;
      const messageIndex = messages.length;

      
      const patterns = [
        /```html\s*\n([\s\S]*?)\n```/,
        /```html\s*([\s\S]*?)```/,
        /```\s*\n([\s\S]*?)\n```/,
        /```\s*([\s\S]*?)```/
      ];

      let extractedCode = "";
      let explanationText = "";

      for (const pattern of patterns) {
        const match = content.match(pattern);
        if (match) {
          extractedCode = match[1].trim();
          explanationText = content.replace(pattern, "").trim();
          break;
        }
      }

  
      setMessageContents(prev => ({
        ...prev,
        [messageIndex]: {
          content,
          explanation: explanationText || undefined
        }
      }));

      if (extractedCode) {
        setGeneratedCode(extractedCode);
        setCodeLanguage("html");
      }
    },
  });

  
  useEffect(() => {
    if (initialMessage && initialMessage.trim() && messages.length === 0 && !initialMessageSentRef.current && !isInitializing) {
      setIsInitializing(true);
      initialMessageSentRef.current = true;
     
      append({ role: "user", content: initialMessage }).finally(() => {
        setIsInitializing(false);
      });
    }
  }, [initialMessage, append, messages.length, isInitializing]);

  
  useEffect(() => {
    initialMessageSentRef.current = false;
    setIsInitializing(false);
  }, [conversationId]);

  const handleSendMessage = async (message: string) => {
    if (isLoading || isInitializing) {
      
      return;
    }
  
    await append({ role: "user", content: message });
  };

  
  const convertedMessages: ConvertedMessage[] = messages.map((message, index) => {
    const storedContent = messageContents[index] || { content: message.content };
    const isCodeResponse = message.role === 'assistant' && !!storedContent.explanation;
    
    return {
      id: index,
      type: message.role === "user" ? "user" : "ai",
      content: message.content,
      timestamp: new Date().toLocaleTimeString(),
      isCode: isCodeResponse,
      explanation: storedContent.explanation
    };
  });


  return (
    <div className="h-[91vh] bg-slate-950 flex">
      <ConversationPanel
        messages={convertedMessages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
      <CodePanel
        code={generatedCode}
        language={codeLanguage}
        onGenerateMore={() =>
          handleSendMessage("Generate more code variations with different styles")
        }
      />
    </div>
  );
}
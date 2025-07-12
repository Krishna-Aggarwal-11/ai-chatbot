import {
  Check,
  Code,
  Copy,
  Download,
  Eye,
  Maximize2,
  Minimize2,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

interface CodePanelProps {
  code: string;
  language: string;
  onGenerateMore: () => void;
}

export function CodePanel({ code, language, onGenerateMore }: CodePanelProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `generated-code.${language === "html" ? "html" : "txt"}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className={`w-1/2  flex flex-col ${isFullscreen ? "fixed inset-0 z-50 w-full" : "relative"}`}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black rounded-lg">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Code Output</h2>
              <p className="text-xs text-gray-500">
                {code ? `${language.toUpperCase()} • ${code.split("\n").length} lines` : "Waiting for code generation..."}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {code && (
              <>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    showPreview
                      ? "bg-black text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? "Code" : "Preview"}
                </button>
                
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    copied
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
                
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                
                <button
                  onClick={onGenerateMore}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1  bg-white">
        {code ? (
          showPreview && language === "html" ? (
            <div className="h-full relative bg-gray-50">
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4 text-gray-700" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-gray-700" />
                  )}
                </button>
              </div>
              
              <iframe
                srcDoc={code}
                className="w-full h-full border-0"
                title="Code Preview"
                sandbox="allow-scripts"
              />
            </div>
          ) : (
            <div className="h-full bg-gray-900 overflow-auto">
              <div className="sticky top-0 left-0 w-full px-4 py-2 bg-gray-800 flex justify-end">
                <span className="text-xs text-gray-300 font-mono">
                  {language.toUpperCase()}
                </span>
              </div>
              
              <pre className="text-gray-100 h-[60vh] mb-4 font-mono text-sm p-4 whitespace-pre-wrap break-words">
                <code>{code}</code>
              </pre>
            </div>
          )
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-xs">
              <div className="mx-auto mb-4 p-4 bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center">
                <Code className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                No code generated
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Describe what you need in the chat to generate code
              </p>
              <div className="flex justify-center gap-4">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Live Preview
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Download className="w-3 h-3" /> Download
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
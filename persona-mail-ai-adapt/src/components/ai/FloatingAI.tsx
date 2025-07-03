
import { useState } from "react";
import { MessageCircle, X, Sparkles, Lightbulb, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface FloatingAIProps {
  selectedEmail?: any;
}

export const FloatingAI = ({ selectedEmail }: FloatingAIProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const aiSuggestions = selectedEmail ? [
    "Summarize this email",
    "Draft a professional reply",
    "Extract action items",
    "Check for urgency level",
    "Suggest follow-up actions"
  ] : [
    "Show me my most important emails",
    "What needs my attention today?",
    "Analyze my email patterns",
    "Suggest productivity improvements",
    "Create email templates"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    // In real app, this would trigger AI processing
    console.log("AI Prompt:", suggestion);
  };

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    
    // Process AI request
    console.log("Processing AI request:", prompt);
    setPrompt("");
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        className={`
          fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg
          bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
          transition-all duration-300 transform hover:scale-110
          ${isOpen ? 'rotate-180' : ''}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Sparkles className="h-6 w-6 text-white" />
        )}
      </Button>

      {/* AI Assistant Panel */}
      {isOpen && (
        <Card className={`
          fixed bottom-24 right-6 z-40 w-80 max-w-[calc(100vw-3rem)] 
          shadow-xl border-0 bg-white/95 backdrop-blur-sm
          animate-in slide-in-from-bottom-4 duration-300
        `}>
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                <p className="text-xs text-gray-500">How can I help you?</p>
              </div>
            </div>

            {/* Context Badge */}
            {selectedEmail && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <MessageCircle className="h-3 w-3 mr-1" />
                Analyzing: {selectedEmail.subject.substring(0, 30)}...
              </Badge>
            )}

            {/* Quick Suggestions */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Quick Actions:</p>
              <div className="grid grid-cols-1 gap-1">
                {aiSuggestions.slice(0, 3).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="justify-start text-xs h-8 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {index === 0 && <Lightbulb className="h-3 w-3 mr-2" />}
                    {index === 1 && <MessageCircle className="h-3 w-3 mr-2" />}
                    {index === 2 && <TrendingUp className="h-3 w-3 mr-2" />}
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="space-y-2">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask me anything about your emails..."
                className="resize-none text-sm"
                rows={2}
              />
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Powered by AI
                </p>
                <Button 
                  size="sm" 
                  onClick={handleSubmit}
                  disabled={!prompt.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Ask
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

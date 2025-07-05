
'use client';

import { useState } from "react";
import { MessageCircle, X, Sparkles, Lightbulb, TrendingUp, Bot } from "lucide-react";
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
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    "Give me a summary of my mails today",
    "Suggest productivity improvements"
  ];

  const handleSuggestionClick = async (suggestion: string) => {
    setPrompt(suggestion);
    setIsLoading(true);
    setResponse("");

    try {
      if (suggestion === "Give me a summary of my mails today") {
        // Mock response for daily summary
        const mockEmails = [
          { sender: "School Portal", subject: "Assignment Due", category: "school" },
          { sender: "Boss", subject: "Meeting Update", category: "work" },
          { sender: "Amazon", subject: "Order Shipped", category: "shopping" }
        ];

        const response = await fetch('/api/ai/daily-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emails: mockEmails }),
        });

        if (response.ok) {
          const { summary } = await response.json();
          setResponse(summary);
        }
      } else if (selectedEmail && suggestion === "Summarize this email") {
        const response = await fetch('/api/ai/summarize-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailContent: selectedEmail.snippet }),
        });

        if (response.ok) {
          const { summary } = await response.json();
          setResponse(summary);
        }
      } else {
        // Mock responses for other suggestions
        const mockResponses = {
          "Show me my most important emails": "Based on your patterns, you have 3 high-priority emails: 1 from your boss about the project deadline, 1 urgent assignment due tomorrow, and 1 client request requiring immediate attention.",
          "What needs my attention today?": "Today you need to: Reply to your boss about the project timeline, Submit your assignment due at 11:59 PM, and Review the client proposal that arrived this morning.",
          "Analyze my email patterns": "Your email patterns show: Peak activity between 9-11 AM and 2-4 PM. You receive 23% work emails, 18% educational, 15% shopping. Average response time: 2.3 hours.",
          "Draft a professional reply": "I'll help you draft a professional response to this email. Please specify the tone and key points you'd like to include.",
          "Extract action items": "Action items from this email: 1. Review attached document by Friday, 2. Confirm meeting attendance, 3. Provide feedback on the proposal.",
          "Check for urgency level": "This email has HIGH urgency based on: deadline mentioned, sender importance, and keywords like 'urgent' and 'ASAP'.",
          "Suggest follow-up actions": "Recommended follow-up: 1. Acknowledge receipt within 1 hour, 2. Schedule time to complete the request, 3. Set reminder for deadline.",
          "Suggest productivity improvements": "To improve your email productivity: 1. Use templates for common responses, 2. Set specific times for checking email, 3. Use categories to prioritize, 4. Enable smart notifications for important senders."
        };
        setResponse(mockResponses[suggestion as keyof typeof mockResponses] || "I'm processing your request...");
      }
    } catch (error) {
      console.error('AI request failed:', error);
      setResponse("Sorry, I couldn't process your request right now.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setResponse("");
    
    // Simulate AI processing
    setTimeout(() => {
      setResponse("I'm processing your custom request. This feature will be enhanced with your API keys.");
      setIsLoading(false);
      setPrompt("");
    }, 1500);
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
                <Bot className="h-4 w-4 text-white" />
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
                Analyzing: {selectedEmail.subject?.substring(0, 30)}...
              </Badge>
            )}

            {/* Quick Suggestions */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Quick Actions:</p>
              <div className="grid grid-cols-1 gap-1">
                {aiSuggestions.slice(0, 4).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="justify-start text-xs h-8 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={isLoading}
                  >
                    {index === 0 && <Lightbulb className="h-3 w-3 mr-2" />}
                    {index === 1 && <MessageCircle className="h-3 w-3 mr-2" />}
                    {index === 2 && <TrendingUp className="h-3 w-3 mr-2" />}
                    {index === 3 && <Bot className="h-3 w-3 mr-2" />}
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Response Area */}
            {(response || isLoading) && (
              <div className="bg-gray-50 rounded-lg p-3">
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">{response}</p>
                )}
              </div>
            )}

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
                  disabled={!prompt.trim() || isLoading}
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

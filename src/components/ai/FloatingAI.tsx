
import { useState } from "react";
import { MessageCircle, X, Sparkles, Lightbulb, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface FloatingAIProps {
  selectedEmail?: any;
  onCategoryFilter?: (category: string) => void;
}

export const FloatingAI = ({ selectedEmail, onCategoryFilter }: FloatingAIProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dailySummary, setDailySummary] = useState<any>(null);
  const { toast } = useToast();

  // Mock email data - in real app this would come from props or API
  const mockEmails = [
    { id: 1, from: "boss@company.com", subject: "Quarterly Review Meeting", category: "work", timestamp: new Date() },
    { id: 2, from: "admissions@university.edu", subject: "Assignment Due Tomorrow", category: "education", timestamp: new Date() },
    { id: 3, from: "john@gmail.com", subject: "Weekend Plans", category: "personal", timestamp: new Date() },
    { id: 4, from: "hr@company.com", subject: "URGENT: Policy Update", category: "work", timestamp: new Date() },
    { id: 5, from: "registrar@university.edu", subject: "Course Registration", category: "education", timestamp: new Date() }
  ];

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

    try {
      if (suggestion === "Give me a summary of my mails today") {
        const response = await fetch('/api/ai/daily-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emails: mockEmails })
        });

        if (response.ok) {
          const data = await response.json();
          setDailySummary(data);
          toast({
            title: "Daily Summary Generated",
            description: "Click on numbers to filter emails by category"
          });
        }
      } else {
        // Handle other AI suggestions
        console.log("Processing AI request:", suggestion);
        toast({
          title: "AI Processing",
          description: `Processing: ${suggestion}`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process AI request",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      // Process AI request
      console.log("Processing AI request:", prompt);
      toast({
        title: "AI Processing",
        description: `Processing: ${prompt}`
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to process request",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setPrompt("");
      setIsOpen(false);
    }
  };

  const handleCategoryClick = (categoryEmails: any[]) => {
    if (onCategoryFilter && categoryEmails.length > 0) {
      const category = categoryEmails[0].category;
      onCategoryFilter(category);
      toast({
        title: "Filtered Emails",
        description: `Showing ${categoryEmails.length} ${category} emails`
      });
    }
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
          fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] 
          shadow-xl border-0 bg-white/95 backdrop-blur-sm dark:bg-gray-800/95
          animate-in slide-in-from-bottom-4 duration-300
        `}>
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">How can I help you?</p>
              </div>
            </div>

            {/* Context Badge */}
            {selectedEmail && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                <MessageCircle className="h-3 w-3 mr-1" />
                Analyzing: {selectedEmail.subject.substring(0, 30)}...
              </Badge>
            )}

            {/* Daily Summary Display */}
            {dailySummary && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg space-y-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900 dark:text-blue-300">Today's Summary</span>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {dailySummary.summary.split(/(\d+)/).map((part: string, index: number) => {
                    const num = parseInt(part);
                    if (!isNaN(num) && num > 0) {
                      return (
                        <button
                          key={index}
                          className="text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
                          onClick={() => {
                            // Find relevant emails based on context
                            const relevantEmails = Object.values(dailySummary.clickableData).flat();
                            if (relevantEmails.length > 0) {
                              handleCategoryClick(relevantEmails as any[]);
                            }
                          }}
                        >
                          {num}
                        </button>
                      );
                    }
                    return part;
                  })}
                </div>
                
                {/* Category breakdown with clickable numbers */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Object.entries(dailySummary.clickableData).map(([category, emails]: [string, any]) => {
                    if (emails.length === 0) return null;
                    return (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(emails)}
                        className="text-xs bg-white dark:bg-gray-700 p-2 rounded border hover:bg-gray-50 dark:hover:bg-gray-600 text-left"
                      >
                        <span className="font-semibold text-blue-600">{emails.length}</span> {category}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Suggestions */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Actions:</p>
              <div className="grid grid-cols-1 gap-1">
                {aiSuggestions.slice(0, 4).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    className="justify-start text-xs h-8 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {index === 0 && <Lightbulb className="h-3 w-3 mr-2" />}
                    {index === 1 && <MessageCircle className="h-3 w-3 mr-2" />}
                    {index === 2 && <TrendingUp className="h-3 w-3 mr-2" />}
                    {index === 3 && <Calendar className="h-3 w-3 mr-2" />}
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
                disabled={isLoading}
              />
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Powered by Gemini AI
                </p>
                <Button 
                  size="sm" 
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {isLoading ? "Processing..." : "Ask"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

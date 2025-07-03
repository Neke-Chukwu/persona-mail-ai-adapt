
import { useState } from "react";
import { ArrowLeft, Star, Archive, Trash2, Reply, ReplyAll, Forward, MoreHorizontal, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { AIReplyBox } from "@/components/ai/AIReplyBox";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface EmailViewProps {
  email: any;
  onClose: () => void;
  showBackButton?: boolean;
}

export const EmailView = ({ email, onClose, showBackButton = false }: EmailViewProps) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [emailSummary, setEmailSummary] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const { toast } = useToast();

  if (!email) return null;

  const getUrgencyColor = (urgency: string | null) => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "";
    }
  };

  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const response = await fetch('/api/ai/summarize-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailContent: fullEmailContent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const { summary } = await response.json();
      setEmailSummary(summary);
      setShowSummary(true);
      
      toast({
        title: "Summary Generated",
        description: "AI has summarized this email for you.",
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Summary Failed",
        description: "Could not generate email summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const fullEmailContent = `${email.snippet} 

This is the full email content that would normally be fetched from the Gmail API. The email discusses various aspects of the ${email.subject.toLowerCase()} and provides detailed information that the recipient needs to review.

Key points covered:
• Important updates and progress
• Next steps and action items  
• Timeline and deadlines
• Contact information for follow-up

Please let me know if you have any questions or need clarification on any of these points. I'm happy to discuss further and provide additional details as needed.

Best regards,
${email.sender}
${email.senderEmail}`;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex items-center space-x-2 ml-auto">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={generateSummary}
              disabled={isGeneratingSummary}
              title="Summarize Email"
            >
              {isGeneratingSummary ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Star className={`h-4 w-4 ${email.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h1 className="text-xl font-semibold text-gray-900 flex-1 pr-4">
              {email.subject}
            </h1>
            {email.urgency && (
              <Badge variant="secondary" className={getUrgencyColor(email.urgency)}>
                {email.urgency} priority
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${email.sender}`} />
              <AvatarFallback>{email.sender.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{email.sender}</span>
                <span className="text-sm text-gray-500">&lt;{email.senderEmail}&gt;</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>to me</span>
                <span>•</span>
                <span>{formatDistanceToNow(email.timestamp, { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      {showSummary && emailSummary && (
        <div className="mx-4 mt-4">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">AI Summary</span>
            </div>
            <p className="text-sm text-blue-800">{emailSummary}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 text-blue-600 hover:text-blue-800"
              onClick={() => setShowSummary(false)}
            >
              Hide Summary
            </Button>
          </Card>
        </div>
      )}

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
              {fullEmailContent}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Button 
            onClick={() => setShowReplyBox(true)}
            className="flex items-center space-x-2"
          >
            <Reply className="h-4 w-4" />
            <span>Reply</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <ReplyAll className="h-4 w-4" />
            <span>Reply All</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Forward className="h-4 w-4" />
            <span>Forward</span>
          </Button>
        </div>

        {/* AI Reply Box */}
        {showReplyBox && (
          <AIReplyBox 
            originalEmail={email}
            onClose={() => setShowReplyBox(false)}
          />
        )}
      </div>
    </div>
  );
};

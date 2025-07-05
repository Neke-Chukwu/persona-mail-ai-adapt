
'use client';

import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Star, 
  Reply, 
  ReplyAll, 
  Forward, 
  Archive, 
  Trash2,
  MoreVertical,
  Paperclip,
  Download,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AIReplyBox } from "@/components/ai/AIReplyBox";
import { formatDistanceToNow, format } from "date-fns";

interface Email {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  time: Date;
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  body?: string;
  to?: string[];
  cc?: string[];
}

interface EmailViewProps {
  email: Email;
  onClose: () => void;
  showBackButton?: boolean;
}

export const EmailView = ({ email, onClose, showBackButton = false }: EmailViewProps) => {
  const [showAIReply, setShowAIReply] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Mock email body - in real app this would come from API
  const emailBody = email.body || `
    <div>
      <p>Hello,</p>
      <p>${email.snippet}</p>
      <p>Please let me know if you have any questions or need any clarification.</p>
      <p>Best regards,<br/>${email.sender}</p>
    </div>
  `;

  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const response = await fetch('/api/ai/summarize-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailContent: email.snippet + "\n\nFrom: " + email.sender
        }),
      });

      if (response.ok) {
        const { summary } = await response.json();
        setSummary(summary);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {email.subject}
          </h1>
          {email.priority === 'high' && (
            <Badge variant="destructive" className="text-xs">High Priority</Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Star className={`h-4 w-4 ${email.isStarred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon">
            <Archive className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Email Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${email.sender}`} />
                  <AvatarFallback>{email.sender.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{email.sender}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    to me {email.to && email.to.length > 1 && `+${email.to.length - 1} others`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {format(email.time, 'MMM d, yyyy')} at {format(email.time, 'h:mm a')}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {formatDistanceToNow(email.time, { addSuffix: true })}
                </p>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">AI Summary</h4>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={generateSummary}
                  disabled={isGeneratingSummary}
                >
                  {isGeneratingSummary ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </div>
              {summary ? (
                <p className="text-sm text-blue-800 dark:text-blue-200">{summary}</p>
              ) : (
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  {isGeneratingSummary ? "Generating summary..." : "Click to generate AI summary"}
                </p>
              )}
            </div>

            {email.hasAttachment && (
              <div className="flex items-center space-x-2 mb-4">
                <Paperclip className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">1 attachment</span>
                <Button variant="ghost" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* Email Body */}
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: emailBody }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button onClick={() => setShowAIReply(!showAIReply)} className="bg-blue-600 hover:bg-blue-700">
              ✨ AI Reply
            </Button>
            <Button variant="outline">
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
            <Button variant="outline">
              <ReplyAll className="h-4 w-4 mr-2" />
              Reply All
            </Button>
            <Button variant="outline">
              <Forward className="h-4 w-4 mr-2" />
              Forward
            </Button>
          </div>
        </div>

        {/* AI Reply Box */}
        {showAIReply && (
          <div className="mt-4">
            <AIReplyBox 
              originalEmail={email}
              onClose={() => setShowAIReply(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

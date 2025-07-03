
import { useState } from "react";
import { Star, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  category: string;
  urgency: "high" | "medium" | "low" | null;
}

interface EmailListProps {
  category: string;
  selectedEmail: Email | null;
  onEmailSelect: (email: Email) => void;
}

// Mock data - in real app this would come from API
const mockEmails: Email[] = [
  {
    id: "1",
    sender: "Sarah Wilson",
    senderEmail: "sarah@techcorp.com",
    subject: "Project Update - Q4 Marketing Campaign",
    snippet: "Hi there! I wanted to give you a quick update on the Q4 marketing campaign progress. We've completed the initial research phase and are now moving into creative development...",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    isStarred: true,
    hasAttachment: true,
    category: "work",
    urgency: "high",
  },
  {
    id: "2",
    sender: "LinkedIn",
    senderEmail: "noreply@linkedin.com",
    subject: "New job opportunity: Senior Frontend Developer",
    snippet: "Based on your profile, we found a job that might interest you. Senior Frontend Developer at TechStart Inc. - Remote, $120k-160k. Apply now to get noticed by the hiring team...",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: false,
    isStarred: false,
    hasAttachment: false,
    category: "applications",
    urgency: "medium",
  },
  {
    id: "3",
    sender: "Amazon",
    senderEmail: "auto-confirm@amazon.com",
    subject: "Your order has been shipped",
    snippet: "Good news! Your order #123-4567890 has been shipped. Track your package: Your delivery is on its way and will arrive by tomorrow. Order details: MacBook Pro M3...",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    category: "shopping",
    urgency: "low",
  },
  {
    id: "4",
    sender: "Michael Chen",
    senderEmail: "m.chen@startup.io",
    subject: "Follow-up on our conversation",
    snippet: "Hey! It was great talking with you yesterday about the frontend developer position. I wanted to follow up with some additional information about the role and our team...",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    category: "applications",
    urgency: "medium",
  },
];

export const EmailList = ({ category, selectedEmail, onEmailSelect }: EmailListProps) => {
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const filteredEmails = mockEmails.filter(email => {
    if (category === "inbox") return true;
    if (category === "starred") return email.isStarred;
    if (category === "sent") return false; // Would filter sent emails
    if (category === "drafts") return false; // Would filter drafts
    return email.category === category;
  });

  const toggleEmailSelection = (emailId: string) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const getUrgencyColor = (urgency: string | null) => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 capitalize">
            {category === "inbox" ? "Inbox" : category.replace("-", " ")}
          </h2>
          <span className="text-sm text-gray-500">
            {filteredEmails.length} emails
          </span>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {filteredEmails.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            No emails in this category
          </div>
        ) : (
          <div>
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                className={`
                  border-b border-gray-100 p-4 cursor-pointer hover:bg-gray-50 transition-colors
                  ${selectedEmail?.id === email.id ? "bg-blue-50 border-blue-200" : ""}
                  ${!email.isRead ? "bg-white" : "bg-gray-50/50"}
                `}
                onClick={() => onEmailSelect(email)}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={selectedEmails.includes(email.id)}
                    onCheckedChange={() => toggleEmailSelection(email.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 mt-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Toggle star functionality
                    }}
                  >
                    <Star 
                      className={`h-4 w-4 ${email.isStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} 
                    />
                  </Button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium truncate ${!email.isRead ? "text-gray-900" : "text-gray-700"}`}>
                          {email.sender}
                        </span>
                        {email.hasAttachment && (
                          <Paperclip className="h-3 w-3 text-gray-400" />
                        )}
                        {email.urgency && (
                          <Badge variant="secondary" className={`text-xs ${getUrgencyColor(email.urgency)}`}>
                            {email.urgency}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatDistanceToNow(email.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className={`text-sm truncate mb-1 ${!email.isRead ? "font-medium text-gray-900" : "text-gray-600"}`}>
                      {email.subject}
                    </div>
                    
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {email.snippet}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

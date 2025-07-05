
'use client';

import { useState, useEffect } from "react";
import { Clock, Star, Paperclip, Archive, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

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
}

interface EmailListProps {
  category: string;
  selectedEmail: Email | null;
  onEmailSelect: (email: Email) => void;
}

export const EmailList = ({ category, selectedEmail, onEmailSelect }: EmailListProps) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockEmails: Email[] = [
      {
        id: "1",
        sender: "John Doe",
        subject: "Weekly Project Update",
        snippet: "Here's the update on the project progress this week. We've completed the design phase and moving to development...",
        time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: false,
        isStarred: true,
        hasAttachment: true,
        category: "work",
        priority: "high"
      },
      {
        id: "2",
        sender: "University Portal",
        subject: "Assignment Due Tomorrow",
        snippet: "This is a reminder that your Computer Science assignment is due tomorrow at 11:59 PM...",
        time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: false,
        isStarred: false,
        hasAttachment: false,
        category: "school",
        priority: "high"
      },
      {
        id: "3",
        sender: "Boss",
        subject: "Team Meeting Reschedule",
        snippet: "Hi team, we need to reschedule tomorrow's meeting to Thursday 3 PM. Please confirm your availability...",
        time: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        isRead: true,
        isStarred: false,
        hasAttachment: false,
        category: "work",
        priority: "medium"
      },
      {
        id: "4",
        sender: "Amazon",
        subject: "Your order has been shipped",
        snippet: "Your recent order has been shipped and will arrive within 2-3 business days...",
        time: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        isRead: true,
        isStarred: false,
        hasAttachment: false,
        category: "shopping",
        priority: "low"
      }
    ];

    setTimeout(() => {
      setEmails(mockEmails);
      setLoading(false);
    }, 500);
  }, [category]);

  const filteredEmails = emails.filter(email => {
    if (category === "inbox") return true;
    if (category === "starred") return email.isStarred;
    if (category === "sent") return false; // No sent emails in mock data
    if (category === "archive") return false; // No archived emails in mock data
    if (category === "trash") return false; // No trashed emails in mock data
    return email.category === category;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
            {category} ({filteredEmails.length})
          </h2>
          <div className="flex items-center space-x-2">
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
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {filteredEmails.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-gray-700">
                <Archive className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No emails</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                There are no emails in this category.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                className={`
                  p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors
                  ${selectedEmail?.id === email.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' : ''}
                  ${!email.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}
                `}
                onClick={() => onEmailSelect(email)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Toggle star
                      }}
                      className="text-gray-400 hover:text-yellow-500"
                    >
                      <Star className={`h-4 w-4 ${email.isStarred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    </button>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <p className={`text-sm ${!email.isRead ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>
                          {email.sender}
                        </p>
                        {email.priority === 'high' && (
                          <Badge variant="destructive" className="text-xs">High</Badge>
                        )}
                        {email.hasAttachment && (
                          <Paperclip className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(email.time, { addSuffix: true })}
                        </span>
                        {!email.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <h3 className={`text-sm mt-1 ${!email.isRead ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200'}`}>
                      {email.subject}
                    </h3>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {email.snippet}
                    </p>
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

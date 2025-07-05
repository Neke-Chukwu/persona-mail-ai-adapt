
'use client';

import { useState } from "react";
import { 
  Inbox, 
  Send, 
  Star, 
  Archive, 
  Trash2, 
  Settings,
  ChevronLeft,
  Plus,
  Folder
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar = ({ 
  selectedCategory, 
  onCategorySelect, 
  onClose,
  isCollapsed = false,
  onToggleCollapse
}: SidebarProps) => {
  const [customCategories, setCustomCategories] = useState([
    { name: "Work", count: 15, color: "bg-blue-500" },
    { name: "Applications", count: 8, color: "bg-green-500" },
    { name: "Shopping", count: 5, color: "bg-purple-500" },
    { name: "Finance", count: 3, color: "bg-orange-500" }
  ]);

  const mainCategories = [
    { name: "inbox", label: "Inbox", icon: Inbox, count: 42 },
    { name: "sent", label: "Sent", icon: Send, count: 0 },
    { name: "starred", label: "Starred", icon: Star, count: 8 },
    { name: "archive", label: "Archive", icon: Archive, count: 0 },
    { name: "trash", label: "Trash", icon: Trash2, count: 2 }
  ];

  if (isCollapsed) {
    return (
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2 dark:bg-gray-800 dark:border-gray-700">
        {mainCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? "secondary" : "ghost"}
              size="icon"
              onClick={() => onCategorySelect(category.name)}
              className="relative"
            >
              <Icon className="h-4 w-4" />
              {category.count > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                >
                  {category.count > 99 ? "99+" : category.count}
                </Badge>
              )}
            </Button>
          );
        })}
        <Separator />
        <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
          <ChevronLeft className="h-4 w-4 rotate-180" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col dark:bg-gray-800 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">Mail</h2>        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Main Categories */}
        <div className="p-2">
          {mainCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "secondary" : "ghost"}
                className="w-full justify-start mb-1"
                onClick={() => onCategorySelect(category.name)}
              >
                <Icon className="h-4 w-4 mr-3" />
                <span className="flex-1 text-left">{category.label}</span>
                {category.count > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {category.count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        <Separator className="my-2" />

        {/* Custom Categories */}
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">
              Categories
            </h3>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          {customCategories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name.toLowerCase() ? "secondary" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => onCategorySelect(category.name.toLowerCase())}
            >
              <div className={`w-3 h-3 rounded-full mr-3 ${category.color}`} />
              <span className="flex-1 text-left">{category.name}</span>
              <Badge variant="secondary" className="ml-auto">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="h-4 w-4 mr-3" />
          Settings
        </Button>
      </div>
    </div>
  );
};

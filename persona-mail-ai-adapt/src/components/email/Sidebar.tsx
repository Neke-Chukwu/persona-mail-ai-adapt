
import { useState, useEffect } from "react";
import { 
  Inbox, 
  Send, 
  FileText, 
  Trash2, 
  Star, 
  Archive,
  Plus,
  Briefcase,
  Users,
  ShoppingBag,
  X,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onClose?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface CustomCategory {
  id: string;
  label: string;
  icon: any;
  count: number;
  description?: string;
}

export const Sidebar = ({ 
  selectedCategory, 
  onCategorySelect, 
  onClose, 
  isCollapsed, 
  onToggleCollapse 
}: SidebarProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [isGeneratingCategories, setIsGeneratingCategories] = useState(false);
  
  const systemCategories = [
    { id: "inbox", label: t("inbox"), icon: Inbox, count: 12 },
    { id: "starred", label: t("starred"), icon: Star, count: 3 },
    { id: "sent", label: t("sent"), icon: Send, count: 0 },
    { id: "drafts", label: t("drafts"), icon: FileText, count: 2 },
    { id: "archive", label: t("archive"), icon: Archive, count: 0 },
    { id: "trash", label: t("trash"), icon: Trash2, count: 0 },
  ];

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('work') || name.includes('job') || name.includes('career')) return Briefcase;
    if (name.includes('shop') || name.includes('order') || name.includes('purchase')) return ShoppingBag;
    if (name.includes('social') || name.includes('friend') || name.includes('family')) return Users;
    if (name.includes('finance') || name.includes('bank') || name.includes('payment')) return FileText;
    return Briefcase;
  };

  useEffect(() => {
    generateAICategories();
  }, []);

  const generateAICategories = async () => {
    setIsGeneratingCategories(true);
    try {
      const response = await fetch('/api/ai/generate-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userContext: "Analyze user's email patterns and create relevant categories"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate categories');
      }

      const { categories } = await response.json();
      
      const formattedCategories = categories.map((cat: any, index: number) => ({
        id: `ai-${index}`,
        label: cat.name,
        icon: getCategoryIcon(cat.name),
        count: cat.estimatedCount || 0,
        description: cat.description
      }));

      setCustomCategories(formattedCategories);
      
      toast({
        title: "Smart Categories Created",
        description: `AI generated ${categories.length} personalized categories for you.`,
      });
    } catch (error) {
      console.error('Error generating AI categories:', error);
      setCustomCategories([
        { id: "work", label: "Work", icon: Briefcase, count: 8 },
        { id: "applications", label: "Job Applications", icon: Users, count: 5 },
        { id: "shopping", label: "Shopping", icon: ShoppingBag, count: 3 },
      ]);
    } finally {
      setIsGeneratingCategories(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className={`h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header with collapse toggle */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && <h2 className="font-semibold">Menu</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-1">
          {systemCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "secondary" : "ghost"}
                className={`w-full justify-start h-10 ${isCollapsed ? 'px-2' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
                title={isCollapsed ? category.label : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="ml-3 flex-1 text-left">{category.label}</span>
                    {category.count > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {category.count}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            );
          })}
        </div>

        {!isCollapsed && <Separator className="mx-4" />}

        <div className="p-4">
          {!isCollapsed && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium text-gray-700">Smart Categories</h3>
                <Sparkles className="h-3 w-3 text-blue-500" />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={generateAICategories}
                disabled={isGeneratingCategories}
              >
                {isGeneratingCategories ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
              </Button>
            </div>
          )}
          
          {isGeneratingCategories ? (
            !isCollapsed && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>AI is analyzing your emails...</span>
                </div>
              </div>
            )
          ) : (
            <div className="space-y-1">
              {customCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "secondary" : "ghost"}
                    className={`w-full justify-start h-10 ${isCollapsed ? 'px-2' : ''}`}
                    onClick={() => handleCategoryClick(category.id)}
                    title={isCollapsed ? category.label : category.description}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="ml-3 flex-1 text-left">{category.label}</span>
                        {category.count > 0 && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {category.count}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

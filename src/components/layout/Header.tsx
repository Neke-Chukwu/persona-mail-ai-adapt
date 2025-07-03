
import { Search, Menu, Settings, User, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onToggleSidebar: () => void;
  onCompose: () => void;
  onShowSettings?: () => void;
  onShowInbox?: () => void;
  currentView?: string;
}

export const Header = ({ 
  onToggleSidebar, 
  onCompose, 
  onShowSettings, 
  onShowInbox,
  currentView = "inbox"
}: HeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PM</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 hidden sm:block">
              PersonaMail
            </h1>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-2 ml-8">
            <Button
              variant={currentView === "inbox" ? "secondary" : "ghost"}
              size="sm"
              onClick={onShowInbox}
            >
              {t("inbox")}
            </Button>
            <Button
              variant={currentView === "settings" ? "secondary" : "ghost"}
              size="sm"
              onClick={onShowSettings}
            >
              {t("settings")}
            </Button>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search mail"
              className="pl-10 bg-gray-50 border-0 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:focus:bg-gray-600"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button 
            onClick={onCompose}
            className="bg-blue-600 hover:bg-blue-700 text-white hidden sm:flex"
          >
            <Edit className="h-4 w-4 mr-2" />
            {t("compose")}
          </Button>
          
          <Button 
            onClick={onCompose}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 text-white sm:hidden"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onShowSettings}>
                <User className="h-4 w-4 mr-2" />
                {t("profile")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShowSettings}>
                <Settings className="h-4 w-4 mr-2" />
                {t("settings")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="mt-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search mail"
            className="pl-10 bg-gray-50 border-0 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:focus:bg-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

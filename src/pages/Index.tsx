import { useState } from "react";
import { Sidebar } from "@/components/email/Sidebar";
import { EmailList } from "@/components/email/EmailList";
import { EmailView } from "@/components/email/EmailView";
import { ComposeModal } from "@/components/email/ComposeModal";
import { FloatingAI } from "@/components/ai/FloatingAI";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Header } from "@/components/layout/Header";
import { Settings } from "@/components/settings/Settings";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("inbox");
  const [showCompose, setShowCompose] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState("inbox"); // inbox, settings
  const isMobile = useIsMobile();

  const handleEmailSelect = (email: any) => {
    setSelectedEmail(email);
    if (isMobile) {
      // On mobile, hide email list when viewing email
      return;
    }
  };

  const handleBackToList = () => {
    setSelectedEmail(null);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setSidebarOpen(false); // Close sidebar on mobile after filtering
  };

  return (
    <ThemeProvider>
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex flex-col dark:bg-gray-900">
          <Header 
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onCompose={() => setShowCompose(true)}
            onShowSettings={() => setCurrentView("settings")}
            onShowInbox={() => setCurrentView("inbox")}
            currentView={currentView}
          />
          
          <div className="flex-1 flex overflow-hidden">
            
            <div className={`
                ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'} 
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                transition-transform duration-300 ease-in-out
                ${isMobile && sidebarOpen ? 'bg-white shadow-lg' : ''}
              `}>
                <Sidebar 
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                  onClose={() => setSidebarOpen(false)}
                  isCollapsed={sidebarCollapsed && !isMobile}
                  onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
              </div>
            

            
            {isMobile && sidebarOpen && currentView === "inbox" && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
              {currentView === "settings" ? (
                <div className="flex-1 overflow-y-auto">
                  <Settings />
                </div>
              ) : (
                <>
                  {/* Email List */}
                  <div className={`
                    ${selectedEmail && isMobile ? 'hidden' : 'flex-1'}
                    ${selectedEmail && !isMobile ? 'w-96' : ''}
                    border-r border-gray-200 bg-white dark:bg-gray-800
                  `}>
                    <EmailList 
                      category={selectedCategory}
                      selectedEmail={selectedEmail}
                      onEmailSelect={handleEmailSelect}
                    />
                  </div>

                  {/* Email View */}
                  {selectedEmail && (
                    <div className={`
                      ${isMobile ? 'fixed inset-0 z-30 bg-white dark:bg-gray-800' : 'flex-1'}
                    `}>
                      <EmailView 
                        email={selectedEmail}
                        onClose={handleBackToList}
                        showBackButton={isMobile}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Floating AI Assistant - only show in inbox view */}
          {currentView === "inbox" && (
            <FloatingAI 
              selectedEmail={selectedEmail} 
              onCategoryFilter={handleCategoryFilter}
            />
          )}

          {/* Compose Modal */}
          {showCompose && (
            <ComposeModal 
              isOpen={showCompose}
              onClose={() => setShowCompose(false)}
            />
          )}
        </div>
      </AuthGuard>
    </ThemeProvider>
  );
};

export default Index;

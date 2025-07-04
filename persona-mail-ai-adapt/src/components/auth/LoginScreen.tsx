
import { useState } from "react";
import { Mail, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LoginScreenProps {
  onLogin: (success: boolean) => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    // Mock login process - in real app this would use Better Auth or similar
    setTimeout(() => {
      setIsLoading(false);
      onLogin(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">PersonaMail</h1>
          <p className="text-gray-600 mt-2">Your intelligent email assistant</p>
        </div>

        {/* Features */}
        <div className="grid gap-4">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-700">AI-powered email replies</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-700">Smart categorization</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border">
            <Mail className="h-5 w-5 text-purple-500" />
            <span className="text-sm text-gray-700">Seamless Gmail integration</span>
          </div>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Connect your Gmail account to begin personalizing your email experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Connecting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Continue with Gmail</span>
                </div>
              )}
            </Button>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy.
              We only request read and send permissions for your email.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

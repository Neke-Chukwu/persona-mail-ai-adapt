import { useState } from "react";
import { Mail, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createAuthClient } from "better-auth/client";

interface LoginScreenProps {
  onLogin: (success: boolean) => void;
}

const authClient = createAuthClient();

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Redirects to Better Auth for Google login
      await authClient.signIn.social({
        provider: "google",
        // Optionally, add scopes for Gmail API access
        scopes: [
          "https://www.googleapis.com/auth/gmail.readonly",
          "https://www.googleapis.com/auth/gmail.send"
        ],
        // You can add prompt: "select_account" if you want to always ask
      });
      // After redirect, the user will be logged in and redirected back
      // The session will be established by Better Auth
      // onLogin will be called after redirect/hydration
    } catch (e) {
      setIsLoading(false);
      onLogin(false);
    }
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
              By continuing, you agree to our Terms of Service and Privacy Policy.<br />
              PersonaMail AI will only request the minimum permissions needed to help you manage and reply to your emails securely.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

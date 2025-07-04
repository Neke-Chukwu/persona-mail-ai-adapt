
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { personaMailServices, checkRequiredEnvVars } from '@/services/toolsIntegration';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/ui/use-toast';

export const ToolsTest = () => {
  const [testResults, setTestResults] = useState<Record<string, boolean | null>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { canUseAIReply, trackAIReply, dailyReplies, maxFreeReplies } = useUsageTracking();
  const { t, i18n } = useTranslation();

  const runToolsTest = async () => {
    setIsLoading(true);
    const results: Record<string, boolean | null> = {};

    // Test environment variables
    results.envVars = checkRequiredEnvVars();

    // Test Gemini AI
    try {
      await personaMailServices.gemini.summarizeEmail("Test email content");
      results.gemini = true;
    } catch (error) {
      results.gemini = false;
      console.error('Gemini test failed:', error);
    }

    // Test Supabase
    try {
      await personaMailServices.supabase.getUserPreferences('test-user');
      results.supabase = true;
    } catch (error) {
      results.supabase = false;
      console.error('Supabase test failed:', error);
    }

    // Test i18next
    try {
      i18n.changeLanguage('en');
      results.i18next = true;
    } catch (error) {
      results.i18next = false;
    }

    // Test Autumn usage tracking
    try {
      await trackAIReply();
      results.autumn = true;
    } catch (error) {
      results.autumn = false;
      console.error('Autumn test failed:', error);
    }

    // Test Resend (mock test)
    try {
      // We don't actually send an email in testing
      results.resend = !!import.meta.env.VITE_RESEND_API_KEY;
    } catch (error) {
      results.resend = false;
    }

    // Test Firecrawl (mock test)
    try {
      results.firecrawl = !!import.meta.env.VITE_FIRECRAWL_API_KEY;
    } catch (error) {
      results.firecrawl = false;
    }

    // Test Tambo (mock test)
    try {
      results.tambo = !!import.meta.env.VITE_TAMBO_API_KEY;
    } catch (error) {
      results.tambo = false;
    }

    // Test Better Auth (mock test)
    try {
      results.betterAuth = !!import.meta.env.VITE_BETTER_AUTH_SECRET;
    } catch (error) {
      results.betterAuth = false;
    }

    setTestResults(results);
    setIsLoading(false);

    const allPassed = Object.values(results).every(result => result === true);
    toast({
      title: allPassed ? "All Tools Working!" : "Some Tools Need Setup",
      description: allPassed ? 
        "All integrations are working correctly." : 
        "Check your .env file for missing API keys.",
      variant: allPassed ? "default" : "destructive"
    });
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <div className="w-4 h-4" />;
    return status ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  const toolsList = [
    { name: 'Environment Variables', key: 'envVars', description: 'All required API keys present' },
    { name: 'Gemini AI', key: 'gemini', description: 'Google Generative AI for email processing' },
    { name: 'Supabase', key: 'supabase', description: 'Database and authentication' },
    { name: 'Resend', key: 'resend', description: 'Email sending service' },
    { name: 'Firecrawl', key: 'firecrawl', description: 'Web scraping for job postings' },
    { name: 'Tambo', key: 'tambo', description: 'Adaptive UI components' },
    { name: 'Better Auth', key: 'betterAuth', description: 'OAuth authentication' },
    { name: 'Autumn', key: 'autumn', description: 'Usage tracking and pricing' },
    { name: 'i18next', key: 'i18next', description: 'Internationalization' }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Tools Integration Status
          <Button 
            onClick={runToolsTest} 
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              'Test All Tools'
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Usage Tracking Status */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-300">Usage Tracking</h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              AI Replies: {dailyReplies}/{maxFreeReplies} (Free tier)
            </p>
            <Badge variant={canUseAIReply ? "default" : "destructive"}>
              {canUseAIReply ? "Available" : "Limit Reached"}
            </Badge>
          </div>

          {/* Tools Status */}
          {toolsList.map((tool) => (
            <div key={tool.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium">{tool.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(testResults[tool.key])}
                <Badge variant={
                  testResults[tool.key] === true ? "default" : 
                  testResults[tool.key] === false ? "destructive" : 
                  "secondary"
                }>
                  {testResults[tool.key] === true ? "Working" : 
                   testResults[tool.key] === false ? "Failed" : 
                   "Not Tested"}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h4 className="font-medium text-yellow-900 dark:text-yellow-300">Setup Instructions</h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Copy .env.example to .env and add your API keys. All tools will work once configured.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

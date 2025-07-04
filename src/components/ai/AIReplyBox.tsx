import { useState, useEffect } from "react";
import { Send, RefreshCw, Settings, X, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useUsageTracking } from "@/hooks/useUsageTracking";
import { useToast } from "@/hooks/use-toast";

interface AIReplyBoxProps {
  originalEmail: any;
  onClose: () => void;
}

export const AIReplyBox = ({ originalEmail, onClose }: AIReplyBoxProps) => {
  const [replyText, setReplyText] = useState("");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [selectedPersona, setSelectedPersona] = useState("default");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const { canUseAIReply, trackAIReply, dailyReplies, maxFreeReplies, customer } = useUsageTracking();
  const { toast } = useToast();

  // Generate suggested reply on component mount
  useEffect(() => {
    if (canUseAIReply) {
      generateAIReply();
    } else {
      toast({
        title: "Daily limit reached",
        description: `You've used ${dailyReplies}/${maxFreeReplies} free AI replies today.`,
        variant: "destructive",
      });
    }
  }, []);

  const generateAIReply = async () => {
    if (!canUseAIReply) {
      toast({
        title: "Daily limit reached",
        description: `You've used ${dailyReplies}/${maxFreeReplies} free AI replies today.`,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai/generate-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailContent: originalEmail.snippet + "\n\nFrom: " + originalEmail.sender,
          tone: selectedTone,
          persona: selectedPersona
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate reply');
      }

      const { reply } = await response.json();
      setReplyText(reply);
      setAiGenerated(true);
      await trackAIReply();
      
      toast({
        title: "AI Reply Generated",
        description: `${maxFreeReplies - dailyReplies - 1} free replies remaining today.`,
      });
    } catch (error) {
      console.error('Error generating reply:', error);
      toast({
        title: "Generation Failed",
        description: "Could not generate AI reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = () => {
    console.log("Sending reply:", replyText);
    toast({
      title: "Reply Sent",
      description: "Your email reply has been sent successfully.",
    });
    onClose();
  };

  return (
    <Card className="p-4 space-y-4 border-blue-200 bg-blue-50/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-blue-900">AI Reply Assistant</span>
          {aiGenerated && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              AI Generated
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            {dailyReplies}/{maxFreeReplies} used today
          </Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Dynamic Pricing & Upgrade Banner */}
      <div className="mt-2 mb-2">
        <div className="flex flex-col items-center justify-center p-3 rounded bg-blue-100 border border-blue-200 text-blue-900 text-sm">
          <div>
            {`Free AI replies: ${maxFreeReplies - dailyReplies > 0 ? maxFreeReplies - dailyReplies : 0} / ${maxFreeReplies} remaining today`}
          </div>
          {!canUseAIReply && (
            <div className="mt-2 flex flex-col items-center">
              <div className="flex items-center text-red-600 font-semibold">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>You've reached your daily free AI reply limit.</span>
              </div>
              <div className="mt-1 text-blue-900">Upgrade to Premium for unlimited AI replies!</div>
              <Button className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold" size="sm" onClick={() => window.open('https://buy.stripe.com/test_upgrade_link', '_blank')}>
                Upgrade to Premium ($10/month)
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Select value={selectedTone} onValueChange={setSelectedTone}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="formal">Formal</SelectItem>
            <SelectItem value="friendly">Friendly</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedPersona} onValueChange={setSelectedPersona}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Persona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="colleague">Colleague</SelectItem>
            <SelectItem value="client">Client-facing</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          size="sm"
          onClick={generateAIReply}
          disabled={isGenerating || !canUseAIReply}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3 mr-1" />
              Regenerate
            </>
          )}
        </Button>
      </div>

      <Textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder={isGenerating ? "AI is generating your reply..." : "Your AI-generated reply will appear here..."}
        className="min-h-32 resize-none"
        disabled={isGenerating}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Settings className="h-3 w-3 mr-1" />
            Advanced
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!replyText.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Send Reply
          </Button>
        </div>
      </div>
    </Card>
  );
};

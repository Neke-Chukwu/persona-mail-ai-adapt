
import { useEffect, useState } from 'react';
import { useCustomer, allowed, track } from 'autumn-js/react';

export const useUsageTracking = () => {
  const customer = useCustomer();
  const [dailyReplies, setDailyReplies] = useState(0);
  const maxFreeReplies = 10;

  const canUseAIReply = allowed({ featureId: "ai_replies" }) && dailyReplies < maxFreeReplies;

  const trackAIReply = async () => {
    if (canUseAIReply) {
      await track("ai_replies");
      setDailyReplies(prev => prev + 1);
    }
  };

  // Reset daily count at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      setDailyReplies(0);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  return {
    canUseAIReply,
    trackAIReply,
    dailyReplies,
    maxFreeReplies,
    customer
  };
};

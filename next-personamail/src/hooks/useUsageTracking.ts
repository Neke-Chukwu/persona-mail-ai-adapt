
'use client';

import { useEffect, useState } from 'react';
import { useCustomer } from 'autumn-js/react';

export const useUsageTracking = () => {
  const customer = useCustomer();
  const [dailyReplies, setDailyReplies] = useState(0);
  const maxFreeReplies = 10;

  const isAllowed = customer?.allowed({ featureId: "messages" });
  const canUseAIReply = isAllowed && dailyReplies < maxFreeReplies;

  const trackAIReply = async () => {
    if (customer && typeof customer.track === 'function') {
      customer.track({ featureId: "messages" });
    }
    setDailyReplies((prev) => prev + 1);
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
    dailyReplies,
    maxFreeReplies,
    trackAIReply,
    customer
  };
};

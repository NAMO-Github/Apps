import { useEffect, useState, useCallback } from 'react';

export const useRefresh = (callback?: () => void) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const startRefreshing = useCallback(() => {
    setIsRefreshing(true);
    callback?.();
  }, [callback]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isRefreshing) {
        setIsRefreshing(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isRefreshing]);

  return [isRefreshing, startRefreshing] as const;
};

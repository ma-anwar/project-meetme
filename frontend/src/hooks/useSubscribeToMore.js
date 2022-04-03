import { useState, useEffect } from 'react';

export function useSubscribeToMore(subToUpdates) {
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!subscribed) {
      subToUpdates();
      setSubscribed(true);
    }
  }, [subscribed, setSubscribed, subToUpdates]);
}

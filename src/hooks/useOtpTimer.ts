import { useEffect, useState } from 'react';

export function useOtpTimer(duration: number = 120) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;

    if (timeLeft === 0) {
      setActive(false);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);

    return () => clearTimeout(timer);
  }, [active, timeLeft]);

  const start = () => {
    setTimeLeft(duration);
    setActive(true);
  };

  const reset = () => {
    setTimeLeft(duration);
    setActive(false);
  };

  return {
    timeLeft,
    active,
    start,
    reset,
  };
}

import { useEffect, useState } from 'react';
import { getTypewriterSlice } from '../utils/portfolioLogic';

export function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    let intervalId: number | undefined;

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setIndex((prev) => {
          if (prev >= text.length) {
            if (intervalId !== undefined) {
              window.clearInterval(intervalId);
            }
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [text, speed, startDelay]);

  return getTypewriterSlice(text, index);
}

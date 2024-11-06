"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
}

export default function TypingAnimation({
  text,
  duration = 200,
  className,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [i, setI] = useState<number>(0);
  const [cursorVisible, setCursorVisible] = useState<boolean>(true);

  // Typing effect
  useEffect(() => {
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        setI(i + 1);
      } else {
        clearInterval(typingEffect);
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [duration, i, text]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorEffect = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(cursorEffect);
    };
  }, []);

  return (
    <h1
      className={cn(
        "font-display text-center text-4xl font-bold tracking-[-0.02em] drop-shadow-sm flex items-center justify-center",
        className,
      )}
    >
      <span className="leading-none">{displayedText}</span>
      <span className={`inline-block -mt-3 transition-opacity duration-100 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}>|</span>
    </h1>
  );
}

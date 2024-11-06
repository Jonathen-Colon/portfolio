'use client'
import FlickeringGrid from "@/components/ui/flickering-grid";
import TypingAnimation from "@/components/ui/typing-animation";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Twitter, Mail, Github } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0">
        <FlickeringGrid 
          squareSize={4}
          gridGap={6}
          flickerChance={0.3}
          color="rgb(255, 255, 255)"
          maxOpacity={0.2}
        />
      </div>

      {/* Main content */}
      <main className="relative flex flex-col items-center justify-center min-h-screen gap-8">
        <TypingAnimation 
          text="Coming Soon..."
          duration={150}
          className="text-4xl sm:text-6xl"
        />

        {/* Social buttons */}
        <div className="flex gap-4">
          <RainbowButton onClick={() => window.open('https://twitter.com/yourusername', '_blank')}>
            <Twitter className="h-5 w-5" />
          </RainbowButton>
          <RainbowButton onClick={() => window.open('mailto:your.email@example.com')}>
            <Mail className="h-5 w-5" />
          </RainbowButton>
          <RainbowButton onClick={() => window.open('https://github.com/yourusername', '_blank')}>
            <Github className="h-5 w-5" />
          </RainbowButton>
        </div>
      </main>
    </div>
  );
}

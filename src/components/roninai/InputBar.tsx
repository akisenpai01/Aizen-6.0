
"use client";

import type { ChangeEvent, FormEvent } from "react";
import React, { useState, useEffect } from "react"; // Added useState and useEffect
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, SendHorizonal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputBarProps {
  inputValue: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isListening: boolean;
  onMicClick: () => void;
  isLoading: boolean;
}

export function InputBar({
  inputValue,
  onInputChange,
  onSubmit,
  isListening,
  onMicClick,
  isLoading,
}: InputBarProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render nothing or a placeholder on the server to avoid hydration mismatch
    // A simple div matching the expected outer structure can be a placeholder.
    return <div className="flex items-center p-2 md:p-3 border-t border-border bg-background/70 backdrop-blur-md h-[60px] md:h-[68px]"></div>;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center p-2 md:p-3 border-t border-border bg-background/70 backdrop-blur-md"
      // Suppress hydration warning for specific attributes if needed, though client-side rendering should solve it.
      // suppressHydrationWarning 
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onMicClick}
        disabled={isLoading}
        className={cn(
          "mr-2 shrink-0 rounded-full",
          isListening ? "bg-destructive/70 text-destructive-foreground animate-pulse" : "text-primary hover:bg-accent/50"
        )}
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        <Mic className="h-5 w-5" />
      </Button>
      <Input
        type="text"
        placeholder="Speak your mind, warrior..."
        value={inputValue}
        onChange={onInputChange}
        disabled={isLoading || isListening}
        className="flex-grow bg-input/50 focus-visible:ring-primary placeholder:text-muted-foreground/70 text-sm md:text-base"
        // suppressHydrationWarning
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={isLoading || !inputValue.trim()}
        className="ml-2 shrink-0 text-primary hover:bg-accent/50 rounded-full"
        aria-label="Send message"
        // suppressHydrationWarning
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <SendHorizonal className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
}


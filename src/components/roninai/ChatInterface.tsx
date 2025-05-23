
"use client";

import type { FormEvent, SpeechSynthesisVoice } from "react"; // Added SpeechSynthesisVoice for prop type
import React, { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InputBar } from "@/components/roninai/InputBar";
import { MessageBubble } from "@/components/roninai/MessageBubble";
// VoiceSelector import removed
import { generateSamuraiResponse } from "@/ai/flows/generate-samurai-response";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

// Fallback for SpeechRecognition
const SpeechRecognition =
  typeof window !== "undefined"
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : undefined;

interface ChatInterfaceProps {
  selectedVoice: SpeechSynthesisVoice | null;
}

export default function ChatInterface({ selectedVoice }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  // selectedVoice, availableVoices states and loadVoices logic removed

  const { toast } = useToast();
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null); 

  const scrollToBottom = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        top: scrollViewportRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  useEffect(() => {
    // Voice loading logic is now in page.tsx

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        // handleSubmit(transcript); // Auto-send after STT
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        toast({
          title: "Speech Recognition Error",
          description: event.error === 'no-speech' ? "No speech detected." : event.error === 'audio-capture' ? "Audio capture failed. Check microphone." : "An error occurred.",
          variant: "destructive",
        });
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
       if (typeof window !== 'undefined') { // Only show toast on client
        toast({
          title: "Feature Not Available",
          description: "Speech recognition is not supported by your browser.",
          variant: "default",
        });
      }
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [toast]);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis && text) {
      window.speechSynthesis.cancel(); // Cancel previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) { // Use prop selectedVoice
        utterance.voice = selectedVoice;
      }
      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        console.error("Speech synthesis error:", event.error);
        toast({
          title: "Text-to-Speech Error",
          description: `Could not play audio response. Error: ${event.error}`,
          variant: "destructive",
        });
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await generateSamuraiResponse({ userInput: text.trim() });
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.samuraiResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      speak(response.samuraiResponse);
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast({
        title: "AI Response Error",
        description: "Failed to get a response from the samurai.",
        variant: "destructive",
      });
       const aiErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Apologies, I encountered an issue and cannot respond right now.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForm = (event?: FormEvent<HTMLFormElement> | string) => {
    if (event && typeof event !== 'string' && event.preventDefault) {
      event.preventDefault();
    }
    const textToSubmit = typeof event === 'string' ? event : inputValue;
    handleSendMessage(textToSubmit);
  };

  const handleMicClick = () => {
    if (!SpeechRecognition) {
      toast({
        title: "Feature Not Available",
        description: "Speech recognition is not supported by your browser.",
        variant: "destructive",
      });
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.abort(); // Abort any previous recognition attempt
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error: any) {
        console.error("Error starting speech recognition:", error);
        // Check if the error is due to recognition already started
        if (error.name === 'InvalidStateError') {
          toast({
            title: "Speech Recognition Active",
            description: "Voice input is already active or processing.",
            variant: "default",
          });
        } else {
          toast({
            title: "Speech Recognition Error",
            description: "Could not start voice input. Try again or check permissions.",
            variant: "destructive",
          });
        }
        setIsListening(false); // Ensure listening state is reset
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-transparent overflow-hidden"> {/* Adjusted for full screen and transparency */}
      {/* Header removed as per previous request to make chatbox full screen */}
      
      <ScrollArea className="flex-grow p-4" viewportRef={scrollViewportRef}> {/* Added padding here for messages */}
        <div className="space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-center items-center p-2">
              <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin text-primary" />
              <p className="ml-2 text-sm md:text-base text-muted-foreground">The samurai is pondering...</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <InputBar
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e.target.value)}
        onSubmit={handleSubmitForm}
        isListening={isListening}
        onMicClick={handleMicClick}
        isLoading={isLoading}
        // The form itself should not need suppressHydrationWarning if InputBar manages client-side state correctly
      />
    </div>
  );
}


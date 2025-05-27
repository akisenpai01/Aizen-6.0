
"use client";

import type { FormEvent, SpeechSynthesisVoice } from "react";
import React, { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InputBar } from "@/components/roninai/InputBar";
import { MessageBubble } from "@/components/roninai/MessageBubble";
import { generateSamuraiResponse } from "@/ai/flows/generate-samurai-response";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { db } from "@/lib/firebase"; // Import Firestore instance
import { collection, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

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
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        let description = "An error occurred during speech recognition.";
        if (event.error === 'no-speech') {
          description = "No speech was detected. Please try again.";
        } else if (event.error === 'audio-capture') {
          description = "Audio capture failed. Please ensure your microphone is working and permissions are enabled.";
        } else if (event.error === 'not-allowed') {
          description = "Microphone access was denied. Please enable microphone permissions in your browser settings for this site.";
        }
        toast({
          title: "Speech Recognition Error",
          description: description,
          variant: "destructive",
        });
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
       if (typeof window !== 'undefined') {
        toast({
          title: "Feature Not Available",
          description: "Speech recognition is not supported by your browser.",
          variant: "default",
        });
      }
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [toast]);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        console.error("Speech synthesis error:", event.error, event);
        toast({
          title: "Text-to-Speech Error",
          description: `Could not play audio response. Error: ${event.error || 'Unknown error'}`,
          variant: "destructive",
        });
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userInput = text.trim();
    const normalizedUserInput = userInput.toLowerCase(); // Normalize for caching

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: userInput,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Check cache first
      const cacheDocRef = doc(db, "cachedResponses", normalizedUserInput);
      const cacheDocSnap = await getDoc(cacheDocRef);

      let aiResponseText: string;

      if (cacheDocSnap.exists()) {
        aiResponseText = cacheDocSnap.data().aiResponse;
        toast({
          title: "Aizen Recalls...",
          description: "This wisdom has been shared before.",
          variant: "default",
        });
      } else {
        const response = await generateSamuraiResponse({ userInput: userInput });
        aiResponseText = response.samuraiResponse;
        // Save to cache
        await setDoc(cacheDocRef, { 
          userInput: normalizedUserInput, 
          aiResponse: aiResponseText,
          createdAt: Timestamp.now() 
        });
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      speak(aiResponseText);

    } catch (error: any) {
      console.error("Error processing message:", error);
      let errorTitle = "AI Response Error";
      let errorMessage = "Failed to get a response from the samurai.";
      if (error.message?.includes("firestore")) {
        errorTitle = "Database Error";
        errorMessage = "Could not access sabiduría from the archives. Ensure Firebase is configured correctly."
      }
      toast({
        title: errorTitle,
        description: errorMessage,
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
        recognitionRef.current?.abort();
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error: any) {
        console.error("Error starting speech recognition:", error);
        if (error.name === 'InvalidStateError') {
          toast({
            title: "Speech Recognition Active",
            description: "Voice input is already active or processing.",
            variant: "default",
          });
        } else {
          toast({
            title: "Speech Recognition Error",
            description: "Could not start voice input. Ensure microphone permissions are granted.",
            variant: "destructive",
          });
        }
        setIsListening(false);
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-transparent overflow-hidden">
      <ScrollArea className="flex-grow p-4" viewportRef={scrollViewportRef}>
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
      />
    </div>
  );
}

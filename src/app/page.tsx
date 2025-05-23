
"use client";

import type { SpeechSynthesisVoice } from 'react'; // Using React's synthetic event type as placeholder, actual type is DOM's SpeechSynthesisVoice
import React, { useState, useEffect, useCallback } from "react";
import ChatInterface from '@/components/roninai/ChatInterface';
import NavBar from '@/components/layout/NavBar';
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { toast } = useToast();

  const loadVoices = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setAvailableVoices(voices);
          // Set a default voice if not already set or if the previous one is gone
          if (!selectedVoice || !voices.find(v => v.voiceURI === selectedVoice.voiceURI)) {
            const defaultEngVoice = voices.find(voice => voice.lang.startsWith("en") && voice.localService);
            const anyEngVoice = voices.find(voice => voice.lang.startsWith("en"));
            const firstVoice = voices[0];
            setSelectedVoice(defaultEngVoice || anyEngVoice || firstVoice || null);
          }
        } else {
          // Handle case where no voices are available initially
           setAvailableVoices([]); // Ensure it's an empty array
           setSelectedVoice(null);
        }
    }
  }, [selectedVoice]);

  useEffect(() => {
    loadVoices(); // Initial load
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // onvoiceschanged can fire multiple times and early, ensure voices are loaded
      const handleVoicesChanged = () => {
        loadVoices();
      };
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      // Sometimes voices are not immediately available, especially on some browsers.
      // A small timeout can help ensure they are loaded.
      const timeoutId = setTimeout(loadVoices, 100);

      return () => {
        clearTimeout(timeoutId);
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, [loadVoices]);

  return (
    <div className="flex flex-col h-screen bg-transparent"> {/* Ensure root div allows background to show */}
      <NavBar
        availableVoices={availableVoices}
        selectedVoice={selectedVoice}
        onSelectVoice={setSelectedVoice}
      />
      <main className="flex-grow flex flex-col overflow-hidden"> {/* Adjusted for full-screen chat */}
        <ChatInterface selectedVoice={selectedVoice} />
      </main>
    </div>
  );
}

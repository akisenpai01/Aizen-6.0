
"use client";

import type { SpeechSynthesisVoice } from 'react'; // DOM type
import React from "react";
import { VoiceSelector } from "@/components/roninai/VoiceSelector";

interface NavBarProps {
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onSelectVoice: (voice: SpeechSynthesisVoice | null) => void;
}

export default function NavBar({ availableVoices, selectedVoice, onSelectVoice }: NavBarProps) {
  return (
    <nav className="bg-background/70 backdrop-blur-md shadow-md p-3 border-b border-border sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-lg font-semibold text-foreground">Aizen</div>
        {availableVoices.length > 0 ? (
          <VoiceSelector
            voices={availableVoices}
            selectedVoice={selectedVoice}
            onSelectVoice={onSelectVoice}
          />
        ) : (
          <div className="text-xs text-muted-foreground">Loading voices...</div>
        )}
      </div>
    </nav>
  );
}

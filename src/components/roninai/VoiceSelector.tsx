
"use client";

import type { SpeechSynthesisVoice } from 'react'; // DOM type
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface VoiceSelectorProps {
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onSelectVoice: (voice: SpeechSynthesisVoice | null) => void;
}

export function VoiceSelector({ voices, selectedVoice, onSelectVoice }: VoiceSelectorProps) {
  if (typeof window === 'undefined' || voices.length === 0) {
    return null;
  }

  const handleVoiceChange = (voiceURI: string) => {
    // Find voice by URI. If URIs are not unique for distinct voices, this will pick the first one.
    const voice = voices.find((v) => v.voiceURI === voiceURI) || null;
    onSelectVoice(voice);
  };

  // Prioritize local English voices, then any local voices, then any English voices, then any voice
  const localEnglishVoices = voices.filter(v => v.lang.startsWith("en") && v.localService);
  const otherLocalVoices = voices.filter(v => !v.lang.startsWith("en") && v.localService);
  const onlineEnglishVoices = voices.filter(v => v.lang.startsWith("en") && !v.localService);
  const otherOnlineVoices = voices.filter(v => !v.lang.startsWith("en") && !v.localService);
  
  const sortedVoices = [
      ...localEnglishVoices, 
      ...otherLocalVoices, 
      ...onlineEnglishVoices, 
      ...otherOnlineVoices
    ];

  const displayVoices = sortedVoices.length > 0 ? sortedVoices : voices;


  return (
    <div className="flex items-center gap-2 max-w-[300px] md:max-w-[350px]">
      <Label htmlFor="voice-select" className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
        Samurai's Voice:
      </Label>
      <Select
        value={selectedVoice?.voiceURI || ""}
        onValueChange={handleVoiceChange}
      >
        <SelectTrigger id="voice-select" className="w-auto min-w-[150px] md:min-w-[180px] h-8 text-xs bg-input/50 focus:ring-primary border-border truncate">
          <SelectValue placeholder="Select Voice" />
        </SelectTrigger>
        <SelectContent className="max-h-60 bg-popover border-border">
          {displayVoices.map((voice, index) => (
            <SelectItem 
              key={`${voice.name}-${voice.lang}-${voice.voiceURI}-${index}`} // Ensure key is unique
              value={voice.voiceURI} // Value for selection logic
              className="text-xs"
            >
              <span title={`${voice.name} (${voice.lang})${voice.localService ? "" : " (Online)"}`}>
                {voice.name} ({voice.lang}) {voice.localService ? "" : "(Online)"}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}


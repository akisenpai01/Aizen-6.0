
"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <div
      className={cn(
        "flex flex-col w-fit max-w-[80%] md:max-w-[70%]",
        isUser ? "items-end self-end ml-auto" : "items-start self-start mr-auto"
      )}
    >
      <div
        className={cn(
          "p-2 md:p-3 rounded-lg shadow-md break-words",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-secondary text-secondary-foreground rounded-bl-none"
        )}
        style={{
          boxShadow: !isUser ? '0 2px 8px rgba(255,255,255,0.1)' : '0 1px 3px rgba(0,0,0,0.2)',
        }}
      >
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
      </div>
      <span className="text-xs text-muted-foreground mt-1 px-1">
        {format(new Date(message.timestamp), "HH:mm")}
      </span>
    </div>
  );
}

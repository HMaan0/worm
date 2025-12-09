"use client";
import { useChat } from "@ai-sdk/react";
import * as React from "react";
import { useState, useEffect } from "react";
import { RotateCcw, ArrowUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";
import LoadingResponse from "./loadingResponse";

interface ChatPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function ChatPanel({ isOpen = true, onClose }: ChatPanelProps) {
  const { messages, sendMessage, setMessages, status } = useChat();
  const [inputValue, setInputValue] = useState("");
  const [isUserTyping, setIsUserTyping] = useState(false);

  const lastMessage = messages[messages.length - 1];
  const lastMessageId = lastMessage?.id;

  useEffect(() => {
    const shouldShowTyping = lastMessage && lastMessage.role === "user";
    if (shouldShowTyping !== isUserTyping) {
      setIsUserTyping(shouldShowTyping);
    }
  }, [lastMessageId, lastMessage?.role, isUserTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    await sendMessage({ text: inputValue });
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInputValue("");
  };
  console.log(status);
  return (
    <div
      className={cn(
        "flex flex-col h-[calc(100vh-2.5rem)] max-h-[calc(100vh-2.5rem)] my-5 mr-5",
        "w-full lg:w-lg",
        isOpen ? "flex bg-gray-50" : "hidden",
        "fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto"
      )}
    >
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-6 py-4 bg-white rounded-lg mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Test Chat</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
            onClick={handleReset}
          >
            <RotateCcw className="size-4" />
            <span className="hidden lg:inline">Reset</span>
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto px-6 py-4 bg-white rounded-lg mb-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center flex-1 h-full">
            <p className="text-gray-500 text-center">Chat with Featherworth</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.role === "user"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-50 text-gray-900"
                  )}
                >
                  <div className="font-sans text-sm wrap-break-word whitespace-pre-wrap overflow-hidden">
                    {message.parts.map((part, i) => {
                      if (part.type === "text") {
                        return (
                          <div key={`${message.id}-${i}`}>
                            {part.text.length > 0 ? (
                              <Markdown>{part.text}</Markdown>
                            ) : (
                              <LoadingResponse />
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isUserTyping && (
              <div className="flex justify-start">
                <LoadingResponse />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 px-6 py-4 bg-white rounded-lg">
        <div className="flex items-center gap-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={status === "ready" ? "Send Message" : inputValue}
            className="flex-1 rounded-lg"
            disabled={status !== "ready"}
          />
          <Button
            onClick={handleSend}
            size="icon"
            disabled={!inputValue.trim() || status !== "ready"}
            className="rounded-full bg-teal-600 hover:bg-teal-700 text-white"
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { ChatPanel } from "@/components/chat-panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 pb-16 lg:pb-0">
        {children}
      </main>
      {/* Desktop Chat Panel */}
      <div className="hidden lg:block">
        <ChatPanel />
      </div>
      {/* Mobile Chat Button */}
      <Button
        onClick={() => setIsChatOpen(true)}
        size="icon"
        className={cn(
          "fixed bottom-20 right-4 z-40 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg h-14 w-14",
          "lg:hidden",
          isChatOpen && "hidden"
        )}
      >
        <MessageSquare className="size-6" />
      </Button>
      {/* Mobile Chat Panel (Full Screen) */}
      {isChatOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsChatOpen(false)}
          />
          <div className="lg:hidden">
            <ChatPanel
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}

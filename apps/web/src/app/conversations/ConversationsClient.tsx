"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";
import LoadingResponse from "@/components/loadingResponse";
import { getConversationMessages } from "@/lib/conversation";

type Conversation = {
  id: number;
  phoneNumber: string;
  lastMessage: string;
  lastUpdated: Date;
};

export default function ConversationsClient({
  initialConversations,
}: {
  initialConversations: Conversation[];
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isUserTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenConversation = async (conv: Conversation) => {
    setLoading(true);
    setOpen(true);
    setMessages([]);
    const data = await getConversationMessages(conv.id);

    // ensure structure matches expected message parts
    const formatted = data.messages.map((m) => ({
      ...m,
      parts: [{ type: "text", text: m.content }],
    }));
    setMessages(formatted);
    setPhoneNumber(data.user?.phoneNumber || "");
    setLoading(false);
  };

  return (
    <>
      {/* List of all conversations */}
      <div className="space-y-4">
        {initialConversations.length === 0 && (
          <p className="text-gray-500 text-center">No conversations yet.</p>
        )}

        {initialConversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => handleOpenConversation(conv)}
            className="w-full text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition p-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{conv.phoneNumber}</p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                  {conv.lastMessage}
                </p>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(conv.lastUpdated).toLocaleString()}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Chat with {phoneNumber}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Chat Container */}
            <div className="flex-1 h-[44vh] min-h-[400px] max-h-[55vh] flex flex-col overflow-y-auto px-6 py-4 bg-white rounded-b-lg">
              {loading && (
                <>
                  <div className="m-auto h-auto">
                    <LoadingResponse />
                  </div>
                </>
              )}
              {!loading && messages.length === 0 ? (
                <div className="flex items-center justify-center flex-1 h-full">
                  <p className="text-gray-500 text-center">
                    Chat with Featherworth
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "relative max-w-[80%] rounded-lg px-4 py-2",
                          message.role === "user"
                            ? "bg-teal-600 text-white"
                            : "bg-gray-50 text-gray-900"
                        )}
                      >
                        <div className="font-sans text-sm whitespace-pre-wrap">
                          {message.parts.map((part: any, i: number) => {
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

                        {/* Timestamp under each message */}
                        <p
                          className={cn(
                            "text-[10px] mt-1",
                            message.role === "user"
                              ? "text-teal-100 text-right"
                              : "text-gray-500 text-left"
                          )}
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Optional Typing Indicator */}
                  {isUserTyping && (
                    <div className="flex justify-start">
                      <LoadingResponse />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

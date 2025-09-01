"use client";
import { useRef, useEffect } from "react";
import { Thread, Message } from "../../dummy-data/inbox";
import { useTheme } from "../hooks/useTheme";

interface ChatPanelProps {
  selectedThread: Thread | null;
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const channelIcons = {
  whatsapp: "💬",
  instagram: "📷",
  email: "📧",
  sms: "💬",
};

export default function ChatPanel({
  selectedThread,
  newMessage,
  onMessageChange,
  onSendMessage,
  onKeyPress,
}: ChatPanelProps) {
  const { theme } = useTheme();
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages area to bottom when thread changes
  useEffect(() => {
    if (selectedThread && messagesContainerRef.current) {
      const container = messagesContainerRef.current;

      // Force scroll to bottom using requestAnimationFrame for better timing
      const scrollToBottom = () => {
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight - container.clientHeight;
        });
      };

      // Multiple attempts with different timings
      scrollToBottom();
      setTimeout(scrollToBottom, 0);
      setTimeout(scrollToBottom, 50);
      setTimeout(scrollToBottom, 200);
    }
  }, [selectedThread]);

  // Also scroll to bottom when component first mounts with a selected thread
  useEffect(() => {
    if (selectedThread && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      setTimeout(() => {
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight - container.clientHeight;
        });
      }, 100);
    }
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onMessageChange(e.target.value);

    const textarea = e.target;
    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 5 * 24;
    textarea.style.height = Math.min(scrollHeight, maxHeight) + "px";
    textarea.style.overflowY = scrollHeight > maxHeight ? "scroll" : "hidden";
  };

  if (!selectedThread) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 -mt-40">
        <div className="text-center">
          <p>Choose a conversation from the inbox to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className={`p-4 border-b ${theme.headerDivider} relative`}>
        <span className={`text-[13px] font-semibold tracking-wider uppercase ${theme.titleText}`}>
          {channelIcons[selectedThread.channel]} {selectedThread.clientName}
        </span>
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-slate-700`} />
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-scroll p-4 space-y-3"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#64748b #1e293b",
        }}
      >
        {selectedThread.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isFromClient ? "justify-start" : "justify-end"}`}
          >
            <div className="max-w-xs">
              <p className="text-xs text-gray-500 mb-1 text-center">
                {message.timestamp.toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <div
                className={`p-3 rounded-2xl group relative ${
                  message.isFromClient
                    ? "bg-slate-700 text-white rounded-bl-md hover:bg-slate-600"
                    : "bg-red-500 text-white rounded-br-md hover:bg-red-600"
                }`}
              >
                <p className="text-sm">{message.content}</p>

                {/* Hover Options */}
                <div
                  className={`absolute ${
                    message.isFromClient ? "right-0 top-0" : "left-0 top-0"
                  } opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                  {message.isFromClient ? (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs -mt-8 mr-2">
                      Reply
                    </button>
                  ) : (
                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs -mt-8 ml-2">
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2 items-end">
          <textarea
            ref={chatInputRef}
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={onKeyPress}
            placeholder="Type a message..."
            className="flex-1 rounded-xl px-4 py-2 ring-1 focus:ring-2 focus:ring-red-500/40 bg-transparent border border-slate-700 outline-none resize-none text-sm"
            rows={1}
            style={{
              minHeight: "40px",
              maxHeight: "120px",
              scrollbarWidth: "thin",
              scrollbarColor: "#64748b #1e293b",
            }}
          />
          <button
            onClick={onSendMessage}
            disabled={!newMessage.trim()}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

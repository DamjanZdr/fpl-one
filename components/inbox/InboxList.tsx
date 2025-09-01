"use client";
import { Thread } from "../../dummy-data/inbox";
import { useTheme } from "../hooks/useTheme";

interface InboxListProps {
  threads: Thread[];
  selectedThread: Thread | null;
  onThreadSelect: (thread: Thread) => void;
  searchThreads: string;
  onSearchChange: (search: string) => void;
  filterChannel: string;
  onChannelFilterChange: (channel: string) => void;
  filterRead: string;
  onReadFilterChange: (read: string) => void;
  totalUnread: number;
  onNewWhatsApp: () => void;
}

const channelIcons = {
  whatsapp: "💬",
  instagram: "📷",
  email: "📧",
  sms: "💬",
};

export default function InboxList({
  threads,
  selectedThread,
  onThreadSelect,
  searchThreads,
  onSearchChange,
  filterChannel,
  onChannelFilterChange,
  filterRead,
  onReadFilterChange,
  totalUnread,
  onNewWhatsApp,
}: InboxListProps) {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col h-full">
      {/* Inbox Header */}
      <div
        className={`flex items-center justify-between p-4 border-b ${theme.headerDivider} relative`}
      >
        <div className="flex items-center gap-3">
          <span className={`text-[13px] font-semibold tracking-wider uppercase ${theme.titleText}`}>
            Inbox
          </span>
          {totalUnread > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {totalUnread}
            </span>
          )}
        </div>
        <button
          onClick={onNewWhatsApp}
          className="text-xs bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-white"
        >
          + New WhatsApp
        </button>
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-slate-700`} />
      </div>

      {/* Filters */}
      <div className="p-4 space-y-3 border-b border-slate-700">
        <input
          className="w-full rounded-xl px-4 py-2 ring-1 focus:ring-2 focus:ring-red-500/40 bg-transparent border border-slate-700 outline-none text-sm"
          placeholder="Search conversations..."
          value={searchThreads}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <div className="flex gap-2">
          <select
            className="flex-1 rounded-xl px-2 py-2 ring-1 border border-slate-700 bg-black/90 text-white focus:ring-2 focus:ring-red-500/40 outline-none text-xs"
            value={filterChannel}
            onChange={(e) => onChannelFilterChange(e.target.value)}
          >
            <option value="all">All Channels</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>

          <select
            className="flex-1 rounded-xl px-2 py-2 ring-1 border border-slate-700 bg-black/90 text-white focus:ring-2 focus:ring-red-500/40 outline-none text-xs"
            value={filterRead}
            onChange={(e) => onReadFilterChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Thread List */}
      <div
        className="flex-1 overflow-y-scroll p-4 space-y-2"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#64748b #1e293b",
        }}
      >
        {threads.map((thread) => (
          <div
            key={thread.id}
            onClick={() => onThreadSelect(thread)}
            className={`p-3 rounded-xl cursor-pointer border transition-colors ${
              selectedThread?.id === thread.id
                ? "bg-red-500/20 border-red-500/50"
                : "border-slate-700 hover:border-slate-600 hover:bg-white/5"
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm">{channelIcons[thread.channel]}</span>
                <span className="font-medium text-sm">{thread.clientName}</span>
              </div>
              {thread.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[18px] text-center">
                  {thread.unreadCount}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-400 truncate mb-1">
              {thread.isLastMessageFromUs ? "You: " : ""}
              {thread.lastMessage}
            </p>

            <p className="text-xs text-gray-500">
              {thread.lastMessageTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

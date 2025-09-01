"use client";
import { useState } from "react";
import { useTheme } from "../../components/hooks/useTheme";
import Card from "../../components/ui/Card";
import InboxList from "../../components/inbox/InboxList";
import ChatPanel from "../../components/inbox/ChatPanel";
import SupportPanel from "../../components/inbox/SupportPanel";
import ResizableDivider from "../../components/inbox/ResizableDivider";
import PhoneNumberModal from "../../components/inbox/PhoneNumberModal";
import { useResizablePanels } from "../../components/inbox/useResizablePanels";
import { threads, Thread } from "../../dummy-data/inbox";

export default function InboxPage() {
  const { theme } = useTheme();
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [searchThreads, setSearchThreads] = useState("");
  const [filterChannel, setFilterChannel] = useState<string>("all");
  const [filterRead, setFilterRead] = useState<string>("all");
  const [newMessage, setNewMessage] = useState("");
  const [connectedClient, setConnectedClient] = useState<string | null>(null);
  const [showPhoneNumberModal, setShowPhoneNumberModal] = useState(false);
  const [allThreads, setAllThreads] = useState<Thread[]>(threads);

  const {
    leftPanelWidth,
    rightPanelWidth,
    middlePanelWidth,
    isDragging,
    containerRef,
    handleMouseDown,
  } = useResizablePanels();

  // Filter threads
  const filteredThreads = allThreads.filter((thread) => {
    const matchesSearch =
      thread.clientName.toLowerCase().includes(searchThreads.toLowerCase()) ||
      thread.lastMessage.toLowerCase().includes(searchThreads.toLowerCase());
    const matchesChannel = filterChannel === "all" || thread.channel === filterChannel;
    const matchesRead =
      filterRead === "all" ||
      (filterRead === "unread" && thread.unreadCount > 0) ||
      (filterRead === "read" && thread.unreadCount === 0);

    return matchesSearch && matchesChannel && matchesRead;
  });

  const totalUnread = allThreads.reduce((sum, thread) => sum + thread.unreadCount, 0);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedThread) return;
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Allow Enter to create new lines - only send via Send button
    // No automatic sending on Enter
  };

  const handleCreateWhatsAppChat = (phoneNumber: string) => {
    // Create new thread ID
    const newThreadId = `thread-${Date.now()}`;

    // Create new thread
    const newThread: Thread = {
      id: newThreadId,
      clientName: phoneNumber, // Use phone number as name initially
      channel: "whatsapp",
      lastMessage: "Conversation started",
      lastMessageTime: new Date(),
      isAssigned: false,
      clientId: undefined,
      unreadCount: 0,
      isLastMessageFromUs: true,
      messages: [
        {
          id: `msg-${Date.now()}`,
          content: "Conversation started",
          timestamp: new Date(),
          isFromClient: false,
          isRead: true,
        },
      ],
    };

    // Add to threads list and select it
    setAllThreads((prev) => [newThread, ...prev]);
    setSelectedThread(newThread);
  };

  return (
    <div className="fixed top-20 left-60 right-4 bottom-4">
      <Card
        themeClass={theme.cardChrome}
        headerDivider={theme.headerDivider}
        titleClass={theme.titleText}
        className="h-full overflow-hidden [&>div:last-child]:p-0"
      >
        <div ref={containerRef} className="flex relative" style={{ height: "calc(100vh - 8rem)" }}>
          {/* Left Panel - Inbox List */}
          <div
            className={`flex flex-col border-r ${theme.headerDivider}`}
            style={{ width: `${leftPanelWidth}%`, minWidth: "280px", height: "calc(100vh - 8rem)" }}
          >
            <InboxList
              threads={filteredThreads}
              selectedThread={selectedThread}
              onThreadSelect={setSelectedThread}
              searchThreads={searchThreads}
              onSearchChange={setSearchThreads}
              filterChannel={filterChannel}
              onChannelFilterChange={setFilterChannel}
              filterRead={filterRead}
              onReadFilterChange={setFilterRead}
              totalUnread={totalUnread}
              onNewWhatsApp={() => setShowPhoneNumberModal(true)}
            />
          </div>

          {/* Left Divider - thin draggable area over thin border */}
          <div
            className={`absolute top-0 bottom-0 w-px cursor-col-resize z-50 transition-colors ${
              isDragging === "left" ? "bg-red-500" : "hover:bg-red-500/50"
            }`}
            style={{ left: `${leftPanelWidth}%` }}
            onMouseDown={() => handleMouseDown("left")}
          />

          {/* Middle Panel - Chat */}
          <div
            className={`flex flex-col border-r ${theme.headerDivider}`}
            style={{ width: `${middlePanelWidth}%`, height: "calc(100vh - 8rem)" }}
          >
            <ChatPanel
              selectedThread={selectedThread}
              newMessage={newMessage}
              onMessageChange={setNewMessage}
              onSendMessage={handleSendMessage}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Right Divider - thin draggable area over thin border */}
          <div
            className={`absolute top-0 bottom-0 w-px cursor-col-resize z-50 transition-colors ${
              isDragging === "right" ? "bg-red-500" : "hover:bg-red-500/50"
            }`}
            style={{ left: `${leftPanelWidth + middlePanelWidth}%` }}
            onMouseDown={() => handleMouseDown("right")}
          />

          {/* Right Panel - Support */}
          <div
            className="flex flex-col"
            style={{
              width: `${rightPanelWidth}%`,
              minWidth: "280px",
              height: "calc(100vh - 8rem)",
            }}
          >
            <SupportPanel connectedClient={connectedClient} onClientConnect={setConnectedClient} />
          </div>
        </div>
      </Card>

      {/* Phone Number Modal */}
      <PhoneNumberModal
        isVisible={showPhoneNumberModal}
        onClose={() => setShowPhoneNumberModal(false)}
        onSubmit={handleCreateWhatsAppChat}
      />
    </div>
  );
}

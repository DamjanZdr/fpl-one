"use client";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { useTheme } from "../components/hooks/useTheme";
import * as Icons from "../components/icons";
import { useState } from "react";

const notifications = [
  {
    kind: "Case",
    title: "Case C00000008 updated",
    subtitle: "New document uploaded by client",
    unread: true,
  },
  {
    kind: "Message",
    title: "New message from Wojtek",
    subtitle: "Can we update my PESEL?",
    unread: true,
  },
  {
    kind: "Task",
    title: "Task due: TRC follow-up",
    subtitle: "Reminder to call client",
    unread: false,
  },
];

const tickets = [
  {
    name: "Anna Kowalska",
    service: "Work Permit",
    submitted: "8/31/2025, 10:20:00 AM",
    unclaimed: true,
  },
  {
    name: "John Chen",
    service: "TRC Basic",
    submitted: "8/31/2025, 10:05:00 AM",
    unclaimed: true,
  },
];

export default function HomePage() {
  const { theme, mode } = useTheme();
  const [activeTab, setActiveTab] = useState<"requests" | "messages">("requests");
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
        {/* Notifications Card */}
        <Card
          title="Notifications"
          right={<span className="text-xs opacity-80">2 unread</span>}
          themeClass={theme.cardChrome}
          headerDivider={theme.headerDivider}
          titleClass={theme.titleText}
        >
          <ul className="space-y-4">
            {notifications.map((n, i) => (
              <li
                key={i}
                className={`rounded-xl p-4 ring-1 transition flex items-center gap-4 ${theme.box} ${theme.rowHover}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {n.kind === "Case" && <Icons.FileText className="h-5 w-5" />}
                  {n.kind === "Message" && <Icons.Message className="h-5 w-5" />}
                  {n.kind === "Task" && <Icons.Inbox className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-base mb-1 ${theme.titleText}`}>{n.title}</div>
                  <div className={`text-sm ${theme.secondaryText}`}>{n.subtitle}</div>
                  <a
                    href="#"
                    className={`inline-flex items-center gap-1 text-sm mt-2 ${theme.value}`}
                    style={{ color: "var(--brand-red)" }}
                  >
                    <Icons.Link className="h-4 w-4" /> View
                  </a>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {n.unread && (
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background: "#F8E6E3",
                        color: "#AB1604",
                      }}
                    >
                      New
                    </span>
                  )}
                  <button
                    className={`rounded-lg px-3 py-1.5 text-sm ring-1 transition ${theme.ring} ${theme.ghostHover}`}
                  >
                    Mark read
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Ticket Center Card */}
        <Card
          title="Ticket Center"
          right={
            <div className="flex gap-2">
              <span className="text-xs opacity-80">Requests 2</span>
              <span className="text-xs opacity-80">Messages 2</span>
            </div>
          }
          themeClass={theme.cardChrome}
          headerDivider={theme.headerDivider}
          titleClass={theme.titleText}
        >
          <div
            className={`mb-4 overflow-hidden rounded-2xl border p-1 text-sm ${theme.cardChrome}`}
          >
            <button
              className={`w-1/2 rounded-xl px-4 py-2 font-semibold shadow-inner ${
                activeTab === "requests"
                  ? mode === "dark"
                    ? "bg-black/40 text-white ring-1 ring-white/10"
                    : "bg-black/10 text-black ring-1 ring-black/10"
                  : mode === "dark"
                  ? "text-white hover:bg-white/5 hover:text-white"
                  : "text-black hover:bg-black/5 hover:text-black"
              }`}
              onClick={() => setActiveTab("requests")}
            >
              Requests
            </button>
            <button
              className={`w-1/2 rounded-xl px-4 py-2 font-semibold ${
                activeTab === "messages"
                  ? mode === "dark"
                    ? "bg-black/40 text-white ring-1 ring-white/10"
                    : "bg-black/10 text-black ring-1 ring-black/10"
                  : mode === "dark"
                  ? "text-white hover:bg-white/5 hover:text-white"
                  : "text-black hover:bg-black/5 hover:text-black"
              }`}
              onClick={() => setActiveTab("messages")}
            >
              Messages
            </button>
          </div>
          {activeTab === "requests" ? (
            <ul className="space-y-4">
              {tickets.map((t, i) => (
                <li
                  key={i}
                  className={`rounded-xl p-4 ring-1 transition flex items-center justify-between ${theme.box} ${theme.rowHover}`}
                >
                  <div>
                    <div className={`font-semibold text-base mb-1 ${theme.titleText}`}>
                      {t.name}
                    </div>
                    <div className={`text-sm ${theme.secondaryText}`}>Service: {t.service}</div>
                    <div className={`text-xs ${theme.muted}`}>Submitted: {t.submitted}</div>
                  </div>
                  {t.unclaimed && (
                    <button
                      className={`inline-flex rounded-lg px-3 py-1.5 text-sm font-semibold border border-[#AB1604] bg-[#AB1604] transition hover:bg-[#8C1202] ${
                        mode === "light" ? "text-black" : "text-white"
                      }`}
                    >
                      Claim
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-lg text-gray-500">No messages.</div>
          )}
        </Card>
      </div>
    </>
  );
}

"use client";
import { useTheme } from "./hooks/useTheme";
import ThemeToggle from "./ThemeToggle";
import * as Icons from "./icons";
import React, { useState } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={`relative min-h-screen ${theme.pageText}`}>
      <div className={`absolute inset-0 -z-10 ${theme.pageBg}`} />
      <div
        className={`grid min-h-screen ${
          collapsed ? "grid-cols-[64px_1fr]" : "grid-cols-[220px_1fr]"
        }`}
      >
        {/* Sidebar */}
        <aside
          className={`${
            theme.sidebar
          } border-r p-4 flex flex-col gap-2 transition-all duration-200 ${
            collapsed ? "items-center px-2" : ""
          }`}
        >
          <div
            className={`pb-4 text-lg font-bold flex items-center gap-2 ${theme.titleText}`}
          >
            <button
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed((c) => !c)}
              className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <Icons.Menu className="h-6 w-6 opacity-80" />
            </button>
            {!collapsed && <span className="ml-2">CRM</span>}
          </div>
          <nav
            className={`mt-2 space-y-2 flex-1 flex flex-col ${
              collapsed ? "items-center" : ""
            }`}
          >
            <a
              href="#"
              className={`block rounded-none w-full px-0 py-4 bg-red-700/90 text-white flex items-center gap-4 text-left ${
                collapsed ? "justify-center" : "pl-2"
              }`}
            >
              <Icons.House className="h-6 w-6 opacity-90" />
              {!collapsed && (
                <span className="text-lg font-semibold">Home</span>
              )}
            </a>
            <a
              href="#"
              className={`block rounded-none w-full px-0 py-4 ${
                theme.ghostHover
              } ${theme.pageText} flex items-center gap-4 text-left ${
                collapsed ? "justify-center" : "pl-2"
              }`}
            >
              <Icons.Inbox className="h-6 w-6 opacity-90" />
              {!collapsed && (
                <span className="text-lg font-semibold">Inbox</span>
              )}
            </a>
            <a
              href="#"
              className={`block rounded-none w-full px-0 py-4 ${
                theme.ghostHover
              } flex items-center gap-4 text-left ${
                collapsed ? "justify-center" : "pl-2"
              }`}
            >
              <Icons.User className="h-6 w-6 opacity-90" />
              {!collapsed && (
                <span className="text-lg font-semibold">Clients</span>
              )}
            </a>
            <a
              href="#"
              className={`block rounded-none w-full px-0 py-4 ${
                theme.ghostHover
              } flex items-center gap-4 text-left ${
                collapsed ? "justify-center" : "pl-2"
              }`}
            >
              <Icons.Message className="h-6 w-6 opacity-90" />
              {!collapsed && (
                <span className="text-lg font-semibold">Chat</span>
              )}
            </a>
            <a
              href="#"
              className={`block rounded-none w-full px-0 py-4 ${
                theme.ghostHover
              } flex items-center gap-4 text-left ${
                collapsed ? "justify-center" : "pl-2"
              }`}
            >
              <Icons.Calendar className="h-6 w-6 opacity-90" />
              {!collapsed && (
                <span className="text-lg font-semibold">Tasks</span>
              )}
            </a>
            <a
              href="#"
              className={`block rounded-none w-full px-0 py-4 ${
                theme.ghostHover
              } flex items-center gap-4 text-left ${
                collapsed ? "justify-center" : "pl-2"
              }`}
            >
              <Icons.FileText className="h-6 w-6 opacity-90" />
              {!collapsed && (
                <span className="text-lg font-semibold">Files</span>
              )}
            </a>
            <div className="flex-1" />
            <a
              href="#"
              className={`block rounded-none w-full px-0 py-4 mt-2 ${
                theme.ghostHover
              } flex items-center gap-4 text-left ${
                collapsed ? "justify-center" : "pl-2"
              }`}
            >
              <Icons.Edit className="h-6 w-6 opacity-90" />
              {!collapsed && (
                <span className="text-lg font-semibold">Settings</span>
              )}
            </a>
          </nav>
        </aside>
        <div className="flex flex-col w-full">
          {/* Topbar */}
          <header
            className={`sticky top-0 z-10 ${theme.topbar} border-b px-6 py-3 flex items-center justify-between`}
          >
            <div className={`flex items-center gap-3 ${theme.pageText}`}>
              <Icons.Bell className="h-5 w-5 opacity-80" />
              <span className={`font-semibold text-lg ${theme.titleText}`}>
                Home
              </span>
              <span className={`text-xs opacity-80 ${theme.muted}`}>
                Notifications: 2
              </span>
            </div>
            <ThemeToggle />
          </header>
          {/* Main content */}
          <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

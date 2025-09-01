"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./hooks/useTheme";
import ThemeToggle from "./ThemeToggle";
import * as Icons from "./icons";
import { threads } from "../dummy-data/inbox";
import React, { useState, useEffect, useMemo } from "react";

export default function AppShell2({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme(); // Trigger rebuild
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Single source of truth for widths/heights
  const SB_EXPANDED = "14rem"; // Tailwind w-56 (224px)
  const SB_COLLAPSED = "4rem"; // Tailwind w-16 (64px)
  const HD_HEIGHT = "64px";

  const sbWidth = useMemo(() => (collapsed ? SB_COLLAPSED : SB_EXPANDED), [collapsed]);
  const totalUnread = useMemo(
    () => threads.reduce((sum, thread) => sum + thread.unreadCount, 0),
    []
  );

  useEffect(() => {
    const sidebar = document.querySelector("aside");
    if (sidebar) {
      const bg = window.getComputedStyle(sidebar).backgroundColor;
      console.log("Sidebar computed backgroundColor:", bg);
    }
  }, [theme, collapsed]);

  // Utility: active state
  const isActive = (href: string) => {
    // Treat "/" as exact match; others match by segment start
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  const baseItem =
    "block w-full px-0 py-5 flex items-center gap-3 text-left border-b " + theme.headerDivider;
  const whenExpanded = "pl-8";
  const whenCollapsed = "justify-center";
  const hoverable = theme.ghostHover;
  const activeItem = "bg-red-700/90 text-white";

  return (
    <div
      className={`relative min-h-screen w-full ${theme.pageText}`}
      style={
        {
          // @ts-ignore custom CSS props
          "--sb-w": sbWidth,
          "--hd-h": HD_HEIGHT,
        } as React.CSSProperties
      }
    >
      {/* Background */}
      <div className={`fixed inset-0 ${theme.pageBg}`} style={{ zIndex: 0 }} />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full flex flex-col shadow-2xl backdrop-blur-xl z-50 ${theme.sidebar} border-r ${theme.headerDivider}`}
        style={{ width: "var(--sb-w)", transition: "width 200ms ease" }}
      >
        {/* CRM row (hamburger toggles collapse) */}
        <div
          className={`border-b ${theme.headerDivider} ${theme.sidebar}`}
          style={{ height: "var(--hd-h)", minHeight: "var(--hd-h)" }}
        >
          <div
            className={`h-full flex items-center gap-3 ${collapsed ? "justify-center" : "pl-8"} ${
              theme.titleText
            }`}
            style={{ transition: "padding-left 200ms ease" }}
          >
            <button
              type="button"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed((c) => !c)}
              className={`rounded p-1 transition ${theme.ghostHover}`}
            >
              <Icons.Menu className="h-7 w-7 opacity-80" />
            </button>
            {!collapsed && <span className="text-xl font-bold leading-none">CRM</span>}
          </div>
        </div>

        {/* Nav */}
        <nav className={`mt-2 flex-1 flex flex-col ${collapsed ? "items-center" : ""}`}>
          <Link
            href="/"
            aria-current={isActive("/") ? "page" : undefined}
            className={`${baseItem} ${isActive("/") ? activeItem : hoverable} ${
              collapsed ? whenCollapsed : whenExpanded
            }`}
            style={{ transition: "padding-left 200ms ease" }}
          >
            <Icons.House className="h-7 w-7 opacity-90" />
            {!collapsed && <span className="text-xl font-bold">Home</span>}
          </Link>

          <Link
            href="/inbox"
            aria-current={isActive("/inbox") ? "page" : undefined}
            className={`${baseItem} ${isActive("/inbox") ? activeItem : hoverable} ${
              collapsed ? whenCollapsed : whenExpanded
            }`}
            style={{ transition: "padding-left 200ms ease" }}
          >
            <div className="relative">
              <Icons.Inbox className="h-7 w-7 opacity-90" />
              {totalUnread > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                  {totalUnread}
                </span>
              )}
            </div>
            {!collapsed && <span className="text-xl font-bold">Inbox</span>}
          </Link>

          <Link
            href="/clients"
            aria-current={isActive("/clients") ? "page" : undefined}
            className={`${baseItem} ${isActive("/clients") ? activeItem : hoverable} ${
              collapsed ? whenCollapsed : whenExpanded
            }`}
            style={{ transition: "padding-left 200ms ease" }}
          >
            <Icons.User className="h-7 w-7 opacity-90" />
            {!collapsed && <span className="text-xl font-bold">Clients</span>}
          </Link>

          <Link
            href="/chat"
            aria-current={isActive("/chat") ? "page" : undefined}
            className={`${baseItem} ${isActive("/chat") ? activeItem : hoverable} ${
              collapsed ? whenCollapsed : whenExpanded
            }`}
            style={{ transition: "padding-left 200ms ease" }}
          >
            <Icons.Message className="h-7 w-7 opacity-90" />
            {!collapsed && <span className="text-xl font-bold">Chat</span>}
          </Link>

          <Link
            href="/tasks"
            aria-current={isActive("/tasks") ? "page" : undefined}
            className={`${baseItem} ${isActive("/tasks") ? activeItem : hoverable} ${
              collapsed ? whenCollapsed : whenExpanded
            }`}
            style={{ transition: "padding-left 200ms ease" }}
          >
            <Icons.Calendar className="h-7 w-7 opacity-90" />
            {!collapsed && <span className="text-xl font-bold">Tasks</span>}
          </Link>

          <Link
            href="/files"
            aria-current={isActive("/files") ? "page" : undefined}
            className={`${baseItem} ${isActive("/files") ? activeItem : hoverable} ${
              collapsed ? whenCollapsed : whenExpanded
            }`}
            style={{ transition: "padding-left 200ms ease" }}
          >
            <Icons.FileText className="h-7 w-7 opacity-90" />
            {!collapsed && <span className="text-xl font-bold">Files</span>}
          </Link>

          <div className="flex-1" />

          <Link
            href="/settings"
            aria-current={isActive("/settings") ? "page" : undefined}
            className={`${baseItem} mt-2 ${isActive("/settings") ? activeItem : hoverable} ${
              collapsed ? whenCollapsed : whenExpanded
            }`}
            style={{ transition: "padding-left 200ms ease" }}
          >
            <Icons.Edit className="h-7 w-7 opacity-90" />
            {!collapsed && <span className="text-xl font-bold">Settings</span>}
          </Link>
        </nav>
      </aside>

      {/* Header */}
      <header
        className={`fixed top-0 right-0 left-0 shadow-2xl backdrop-blur-xl z-40 px-6 flex items-center justify-between ${theme.sidebar} border-b ${theme.headerDivider}`}
        style={{
          height: "var(--hd-h)",
          minHeight: "var(--hd-h)",
          paddingLeft: "calc(var(--sb-w) + 0.5rem)",
          transition: "padding-left 200ms ease",
        }}
      >
        <div className={`flex items-center gap-3 ${theme.pageText}`}>
          <Icons.Bell className="h-5 w-5 opacity-80" />
          <span className={`font-semibold text-lg ${theme.titleText}`}>Home</span>
          <span className={`text-xs opacity-80 ${theme.muted}`}>Notifications: 2</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main */}
      <main
        className="mx-auto w-full max-w-7xl px-4 py-6"
        style={{
          paddingLeft: "var(--sb-w)",
          paddingTop: "var(--hd-h)",
          position: "relative",
          zIndex: 1,
          transition: "padding-left 200ms ease",
        }}
      >
        {children}
      </main>
    </div>
  );
}

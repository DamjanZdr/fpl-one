"use client";
import { useEffect, useState, useCallback } from "react";

const themeMap = {
  pageBg: "bg-[#F8FAFC] dark:bg-[#070b12]",
  pageText: "text-slate-900 dark:text-gray-100",
  cardChrome:
    "border-black/10 bg-black/5 ring-black/10 dark:border-white/10 dark:bg-white/5 dark:ring-white/10",
  headerDivider: "border-black/10 dark:border-white/10",
  titleText: "text-slate-900 dark:text-gray-200",
  label: "text-slate-600 dark:text-gray-400",
  value: "text-slate-900 dark:text-gray-100",
  box: "bg-black/6 ring-black/10 dark:bg-black/30 dark:ring-white/10",
  secondaryText: "text-slate-700 dark:text-gray-400",
  muted: "text-slate-500 dark:text-gray-500",
  tableHead: "bg-black/5 text-slate-700 dark:bg-white/10 dark:text-gray-200",
  zebraEven: "bg-black/5 dark:bg-black/20",
  zebraOdd: "bg-transparent dark:bg-black/10",
  rowHover: "hover:bg-black/6 dark:hover:bg-white/10",
  ringStrong: "ring-black/15 dark:ring-white/15",
  ring: "ring-black/10 dark:ring-white/10",
  border: "border-black/10 dark:border-white/10",
  sidebar:
    "border-black/10 bg-black/5 ring-black/10 dark:border-white/10 dark:bg-white/5 dark:ring-white/10",
  // Removed duplicate topbar key
  topbar:
    "border-black/10 bg-black/5 ring-black/10 dark:border-white/10 dark:bg-white/5 dark:ring-white/10",
  ghostHover: "hover:bg-black/10 dark:hover:bg-white/10",
};

export function useTheme() {
  const [mode, setModeState] = useState<"light" | "dark">("dark");

  // On mount, update mode from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as "light" | "dark";
      if (stored && stored !== mode) {
        setModeState(stored);
      }
    }
  }, []);

  const theme = themeMap as Record<string, string>;

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (mode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", mode);
      // Debug: print computed background color and mode for sidebar, CRM/logo row, and top panel
      setTimeout(() => {
        const sidebar = document.querySelector("aside");
        if (sidebar) {
          const bg = window.getComputedStyle(sidebar).backgroundColor;
          console.log(`Sidebar [${mode}] computed backgroundColor:`, bg);
        }
        const crmRow = sidebar?.querySelector("div.pb-4");
        if (crmRow) {
          const bg = window.getComputedStyle(crmRow).backgroundColor;
          console.log(`CRM/logo row [${mode}] computed backgroundColor:`, bg);
        }
        const topbar = document.querySelector("header");
        if (topbar) {
          const bg = window.getComputedStyle(topbar).backgroundColor;
          console.log(`Top panel [${mode}] computed backgroundColor:`, bg);
        }
      }, 100);
    }
  }, [mode, theme]);

  const setMode = useCallback((m: "light" | "dark") => {
    console.log(`Theme toggle button pressed. Changing mode to: ${m}`);
    setModeState(m);
  }, []);

  return { mode, setMode, theme };
}

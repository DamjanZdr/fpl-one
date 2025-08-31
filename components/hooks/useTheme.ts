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
  sidebar: "bg-black/5 border-black/10 dark:bg-white/5 dark:border-white/10",
  topbar: "bg-black/5 border-black/10 dark:bg-white/5 dark:border-white/10",
  ghostHover: "hover:bg-black/10 dark:hover:bg-white/10",
};

export function useTheme() {
  const [mode, setModeState] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "dark";
    }
    return "dark";
  });

  const theme = themeMap as Record<string, string>;

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (mode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", mode);
      console.log("Theme mode:", mode, "Theme classes:", theme);
    }
  }, [mode, theme]);

  const setMode = useCallback((m: "light" | "dark") => setModeState(m), []);

  return { mode, setMode, theme };
}

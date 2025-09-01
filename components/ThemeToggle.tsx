"use client";
import { useTheme } from "./hooks/useTheme";
import { Sun, Moon } from "./icons";

export default function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const isDark = mode === "dark";
  return (
    <button
      type="button"
      className={`rounded-xl px-3 py-2 text-sm inline-flex items-center gap-2 ring-1 ${
        isDark
          ? "ring-white/10 text-gray-200 hover:bg-white/10"
          : "ring-black/10 text-slate-700 hover:bg-black/10"
      }`}
      onClick={() => {
        setMode(isDark ? "light" : "dark");
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

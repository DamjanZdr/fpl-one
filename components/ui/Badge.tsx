import React from "react";

const toneMap = {
  green: {
    dark: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20",
    light: "bg-emerald-500/10 text-emerald-700 ring-emerald-400/20",
  },
  slate: {
    dark: "bg-slate-400/10 text-slate-300 ring-slate-400/20",
    light: "bg-slate-400/10 text-slate-800 ring-slate-400/20",
  },
  red: {
    dark: "bg-red-600/20 text-red-200 ring-red-500/20",
    light: "bg-red-600/20 text-red-700 ring-red-500/20",
  },
  blue: {
    dark: "bg-sky-500/10 text-sky-300 ring-sky-400/20",
    light: "bg-sky-500/10 text-sky-700 ring-sky-400/20",
  },
};

interface BadgeProps {
  mode: "light" | "dark";
  tone?: "green" | "slate" | "red" | "blue";
  children?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ mode, tone = "slate", children }) => {
  const styles = toneMap[tone]?.[mode] || toneMap["slate"][mode];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ring-1 ${styles}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
};

export default Badge;

/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // bg
    "bg-[#070b12]",
    "bg-[#F8FAFC]",
    "bg-white/5",
    "bg-black/5",
    "bg-black/6",
    "bg-black/10",
    "bg-black/20",
    "bg-black/30",
    "bg-black/40",
    "bg-emerald-500/10",
    "bg-slate-400/10",
    "bg-red-600/20",
    "bg-sky-500/10",
    // text
    "text-gray-100",
    "text-gray-200",
    "text-gray-400",
    "text-gray-500",
    "text-slate-900",
    "text-slate-600",
    "text-slate-700",
    "text-slate-800",
    "text-emerald-300",
    "text-emerald-700",
    "text-red-200",
    "text-red-700",
    "text-sky-300",
    "text-sky-700",
    // border
    "border-white/10",
    "border-black/10",
    "border-emerald-400/20",
    "border-slate-400/20",
    "border-red-500/20",
    "border-sky-400/20",
    // ring
    "ring-white/10",
    "ring-white/15",
    "ring-black/10",
    "ring-black/15",
    "ring-emerald-400/20",
    "ring-slate-400/20",
    "ring-red-500/20",
    "ring-sky-400/20",
    // hover
    "hover:bg-white/10",
    "hover:bg-black/6",
    "hover:bg-black/10",
    "hover:bg-white/5",
    "hover:text-white",
    "hover:text-slate-900",
    // shadow
    "shadow-2xl",
    "shadow-black/40",
    "shadow-inner",
    "shadow-black/30",
    "shadow-lg",
    // rounded
    "rounded-3xl",
    "rounded-2xl",
    "rounded-xl",
    "rounded-lg",
    "rounded-full",
    // misc
    "backdrop-blur-xl",
    "opacity-80",
    "opacity-60",
    "opacity-70",
    "opacity-30",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "var(--brand-red)",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/postcss")],
};

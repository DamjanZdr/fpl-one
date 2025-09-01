import "./globals.css";
import type { ReactNode } from "react";
import AppShell from "../components/AppShell";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className="bg-transparent">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

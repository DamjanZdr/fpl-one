"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";

const nav = [
  { href: "/", label: "Home" },
  { href: "/inbox", label: "Inbox" },
  { href: "/clients", label: "Clients" },
  { href: "/cases", label: "Cases" },
  { href: "/tasks", label: "Tasks" },
  { href: "/files", label: "Files" },
  { href: "/admin", label: "Admin" },
];

export default function LayoutChrome({ children }) {
  const path = usePathname() || "/";
  const active = (href) => (path === href ? styles.active : "");
  const title = nav.find((n) => path.startsWith(n.href))?.label || "Dashboard";
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>CRM</div>
        <nav className={styles.nav}>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`${styles.navLink} ${active(n.href)}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      <header className={styles.header}>
        <div className={styles.title}>{title}</div>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 12 }}>Welcome to CRM</h1>
      <p>Open one of the sections:</p>
      <ul style={{ marginTop: 10, display: "grid", gap: 8 }}>
        <li>
          <Link href="/inbox">Inbox</Link>
        </li>
        <li>
          <Link href="/clients">Clients</Link>
        </li>
        <li>
          <Link href="/cases">Cases</Link>
        </li>
        <li>
          <Link href="/tasks">Tasks</Link>
        </li>
        <li>
          <Link href="/files">Files</Link>
        </li>
        <li>
          <Link href="/admin">Admin</Link>
        </li>
      </ul>
    </div>
  );
}

import styles from "./page.module.css";
import { getClients } from "@/lib/clients";

export const dynamic = "force-static";

export default async function ClientsPage() {
  const clients = await getClients();
  return (
    <div>
      <div className={styles.tableWrap}>
        {clients.length === 0 ? (
          <div className={styles.empty}>No clients yet.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{new Date(c.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

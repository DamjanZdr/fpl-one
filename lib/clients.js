// Simple mock of clients; later replace the implementation to fetch from Supabase
// Data shape: { id: string|number, name: string, created_at: ISO string }

export async function getClients() {
  // Simulate async behavior
  await new Promise((r) => setTimeout(r, 50));
  return [
    {
      id: 1,
      name: "Acme Corp",
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      id: 2,
      name: "Globex",
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    { id: 3, name: "Initech", created_at: new Date().toISOString() },
  ];
}

// Example future replacement using Supabase (not used yet):
// import { assertSupabase } from "./supabaseClient";
// export async function getClients() {
//   const supabase = assertSupabase();
//   const { data, error } = await supabase
//     .from("clients")
//     .select("id, name, created_at")
//     .order("created_at", { ascending: false });
//   if (error) throw error;
//   return data;
// }

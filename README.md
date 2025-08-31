Minimal CRM scaffold using Next.js App Router (JavaScript) with CSS Modules and Supabase client configured.

Environment variables:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

Pages:

- /inbox, /clients, /cases, /tasks, /files, /admin

Getting Started

1. Optionally create `.env.local` with your Supabase vars.
2. Run: `npm run dev`

Notes

- Shared layout with sidebar and title is under `app/(crm)/layout.js` and `layout.module.css`.
- Clients page uses mock data via `lib/clients.js`. A commented Supabase version is included for later.

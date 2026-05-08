// api/db.js — Universal Supabase proxy for InvoiceAI dashboard data
// Handles: profiles, clients, invoices, proposals, brand_kits
// Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//
// ── SQL to run once in Supabase SQL editor ────────────────────────────────────
//
// create table profiles (
//   id uuid primary key references auth.users(id),
//   first_name text, last_name text, email text,
//   phone text, website text, bio text,
//   biz_name text, vat_number text, iban text, bic text,
//   street text, city text, country text default 'DE',
//   notif_proposal boolean default true,
//   notif_invoice boolean default true,
//   notif_overdue boolean default true,
//   notif_digest boolean default false,
//   updated_at timestamptz default now()
// );
//
// create table clients (
//   id uuid primary key default gen_random_uuid(),
//   user_id uuid not null,
//   name text not null, email text, company text,
//   country text default 'DE', city text,
//   vat_number text, iban text, notes text,
//   avatar text, color text,
//   created_at timestamptz default now()
// );
//
// create table invoices (
//   id uuid primary key default gen_random_uuid(),
//   user_id uuid not null,
//   client_id uuid references clients(id),
//   inv_number text not null,
//   issue_date date, due_date date,
//   status text default 'draft',
//   amount_net numeric(12,2) default 0,
//   amount_vat numeric(12,2) default 0,
//   amount_gross numeric(12,2) default 0,
//   currency text default 'EUR',
//   data jsonb,
//   created_at timestamptz default now()
// );
//
// create table proposals (
//   id uuid primary key default gen_random_uuid(),
//   user_id uuid not null,
//   client_id uuid references clients(id),
//   title text not null,
//   status text default 'draft',
//   value numeric(12,2) default 0,
//   sent_at timestamptz,
//   view_count int default 0,
//   last_viewed_at timestamptz,
//   data jsonb,
//   created_at timestamptz default now()
// );
//
// create table brand_kits (
//   id uuid primary key default gen_random_uuid(),
//   user_id uuid not null,
//   name text not null,
//   primary_color text default '#17A99E',
//   font text default 'DM Sans',
//   logo_text text,
//   created_at timestamptz default now()
// );
//
// -- Enable RLS on all tables
// alter table profiles   enable row level security;
// alter table clients    enable row level security;
// alter table invoices   enable row level security;
// alter table proposals  enable row level security;
// alter table brand_kits enable row level security;
//
// -- RLS policies (repeat pattern for each table)
// create policy "profiles_own"   on profiles   for all using (auth.uid() = id);
// create policy "clients_own"    on clients    for all using (auth.uid() = user_id);
// create policy "invoices_own"   on invoices   for all using (auth.uid() = user_id);
// create policy "proposals_own"  on proposals  for all using (auth.uid() = user_id);
// create policy "brand_kits_own" on brand_kits for all using (auth.uid() = user_id);

const ALLOWED_TABLES = ["profiles", "clients", "invoices", "proposals", "brand_kits"];

export default async function handler(req, res) {
  try {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars" });
  }

  // ── GET — list rows for a user, or single profile ─────────────────────────
  if (req.method === "GET") {
    const { table, user_id, id } = req.query;

    if (!table || !ALLOWED_TABLES.includes(table)) {
      return res.status(400).json({ error: "Invalid table: " + table });
    }

    // Single row by id
    if (id) {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .single();
      if (error) return res.status(404).json({ error: error.message });
      return res.status(200).json(data);
    }

    // Profile is keyed by user_id directly as id
    if (table === "profiles") {
      if (!user_id) return res.status(400).json({ error: "user_id required" });
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user_id)
        .single();
      // Return empty object if no profile yet — not an error
      if (error && error.code === "PGRST116") return res.status(200).json({});
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data || {});
    }

    // All rows for user
    if (!user_id) return res.status(400).json({ error: "user_id required" });
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data || []);
  }

  // ── POST — insert, update, upsert, delete ─────────────────────────────────
  if (req.method === "POST") {
    const { table, action, id, user_id, payload } = req.body;

    if (!table || !ALLOWED_TABLES.includes(table)) {
      return res.status(400).json({ error: "Invalid table: " + table });
    }

    // Insert
    if (action === "insert") {
      if (!user_id) return res.status(400).json({ error: "user_id required" });
      const row = Object.assign({}, payload, { user_id: user_id });
      const { data, error } = await supabase
        .from(table)
        .insert([row])
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    // Update
    if (action === "update") {
      if (!id) return res.status(400).json({ error: "id required for update" });
      const updates = Object.assign({}, payload, { updated_at: new Date().toISOString() });
      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    // Upsert (used for profiles — keyed by user id)
    if (action === "upsert") {
      if (!user_id) return res.status(400).json({ error: "user_id required" });
      const row = Object.assign({}, payload, {
        id: user_id,
        updated_at: new Date().toISOString(),
      });
      const { data, error } = await supabase
        .from(table)
        .upsert([row], { onConflict: "id" })
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    // Delete
    if (action === "delete") {
      if (!id) return res.status(400).json({ error: "id required for delete" });
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ deleted: id });
    }

    return res.status(400).json({ error: "Unknown action: " + action });
  }

  return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("db handler error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}

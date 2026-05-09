// api/share.js — Invoice sharing portal
// POST: save invoice snapshot → returns { id }
// GET:  fetch invoice by id → returns invoice data, increments view_count
//
// Supabase table (run once):
//
// create table shared_invoices (
//   id uuid primary key default gen_random_uuid(),
//   user_id uuid,
//   inv_number text,
//   seller_name text, seller_street text, seller_city text,
//   seller_vat text, seller_iban text, seller_bic text, seller_email text,
//   buyer_name text, buyer_street text, buyer_city text, buyer_vat text,
//   issue_date date, due_date date, currency text default 'EUR',
//   terms text default '30',
//   subtotal numeric(12,2) default 0,
//   vat_amount numeric(12,2) default 0,
//   vat_rate numeric(5,2) default 0,
//   total numeric(12,2) default 0,
//   reverse_charge boolean default false,
//   vat_exempt boolean default false,
//   late_payment boolean default false,
//   gdpr boolean default false,
//   credit_note boolean default false,
//   proj_ref text,
//   lines jsonb default '[]',
//   view_count int default 0,
//   last_viewed_at timestamptz,
//   status text default 'sent',
//   created_at timestamptz default now()
// );
//
// No RLS needed — this is public read (portal link is the auth).
// Service role key handles writes.

export default async function handler(req, res) {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // ── GET — fetch invoice by id, increment view count ──────────────────────
    if (req.method === "GET") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "id required" });

      const { data, error } = await supabase
        .from("shared_invoices")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: "Invoice not found." });
      }

      // Increment view count in background — don't await
      supabase.from("shared_invoices").update({
        view_count: (data.view_count || 0) + 1,
        last_viewed_at: new Date().toISOString(),
      }).eq("id", id).then(function(){}).catch(function(){});

      return res.status(200).json(data);
    }

    // ── POST — save invoice snapshot ─────────────────────────────────────────
    if (req.method === "POST") {
      const body = req.body;
      if (!body || !body.inv_number) {
        return res.status(400).json({ error: "inv_number required" });
      }

      const row = {
        inv_number:     body.inv_number    || "",
        seller_name:    body.seller_name   || "",
        seller_street:  body.seller_street || "",
        seller_city:    body.seller_city   || "",
        seller_vat:     body.seller_vat    || "",
        seller_iban:    body.seller_iban   || "",
        seller_bic:     body.seller_bic    || "",
        seller_email:   body.seller_email  || "",
        buyer_name:     body.buyer_name    || "",
        buyer_street:   body.buyer_street  || "",
        buyer_city:     body.buyer_city    || "",
        buyer_vat:      body.buyer_vat     || "",
        issue_date:     body.issue_date    || new Date().toISOString().slice(0,10),
        due_date:       body.due_date      || null,
        currency:       body.currency      || "EUR",
        terms:          String(body.terms  || "30"),
        subtotal:       Number(body.subtotal    || 0),
        vat_amount:     Number(body.vat_amount  || 0),
        vat_rate:       Number(body.vat_rate    || 0),
        total:          Number(body.total       || 0),
        reverse_charge: Boolean(body.reverse_charge),
        vat_exempt:     Boolean(body.vat_exempt),
        late_payment:   Boolean(body.late_payment),
        gdpr:           Boolean(body.gdpr),
        credit_note:    Boolean(body.credit_note),
        proj_ref:       body.proj_ref || "",
        lines:          Array.isArray(body.lines) ? body.lines : [],
        view_count:     0,
        status:         "sent",
      };

      const { data, error } = await supabase
        .from("shared_invoices")
        .insert([row])
        .select("id")
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ id: data.id });
    }

    return res.status(405).json({ error: "Method not allowed" });

  } catch (err) {
    console.error("share handler error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}

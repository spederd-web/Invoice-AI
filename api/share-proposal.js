// api/share-proposal.js
// POST: create a shareable proposal link
// GET:  fetch proposal by share id, increment view_count
//
// SQL (run once):
// create table shared_proposals (
//   id uuid primary key default gen_random_uuid(),
//   proposal_id uuid,
//   user_id uuid,
//   title text,
//   value numeric(12,2) default 0,
//   content text,
//   view_count int default 0,
//   last_viewed_at timestamptz,
//   created_at timestamptz default now()
// );

export default async function handler(req, res) {
  try {
    var { createClient } = await import("@supabase/supabase-js");
    var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (req.method === "GET") {
      var { id } = req.query;
      if (!id) return res.status(400).json({ error: "id required" });
      var { data, error } = await supabase.from("shared_proposals").select("*").eq("id", id).single();
      if (error || !data) return res.status(404).json({ error: "Proposal not found" });
      // Increment view count in background
      supabase.from("shared_proposals").update({
        view_count: (data.view_count || 0) + 1,
        last_viewed_at: new Date().toISOString(),
      }).eq("id", id).then(function(){}).catch(function(){});
      // Also update the proposals table view_count if proposal_id exists
      if (data.proposal_id && data.user_id) {
        supabase.from("proposals").update({
          view_count: (data.view_count || 0) + 1,
          last_viewed_at: new Date().toISOString(),
          status: "viewed",
        }).eq("id", data.proposal_id).then(function(){}).catch(function(){});
      }
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      var { proposal_id, title, value, user_id, content } = req.body;
      var { data, error } = await supabase.from("shared_proposals").insert([{
        proposal_id: proposal_id || null,
        user_id: user_id || null,
        title: title || "",
        value: Number(value || 0),
        content: content || "",
        view_count: 0,
      }]).select("id").single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ id: data.id });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("share-proposal error:", err);
    return res.status(500).json({ error: err.message });
  }
}

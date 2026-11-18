// Supabase Edge Function: offer-sheet
// Writes the one-page offer sheet for the Productize Your Genius Offer Builder.
// Deploy:   supabase functions deploy offer-sheet --no-verify-jwt
// Secret:   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
// Then set AI_ENDPOINT in index.html to https://<project-ref>.supabase.co/functions/v1/offer-sheet

const ALLOWED_ORIGINS = ["https://www.diygenius.com", "https://diygenius.com", "https://kaaist.github.io"];
const MODEL = "claude-sonnet-5-5";

function cors(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

Deno.serve(async (req) => {
  const headers = cors(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response(null, { headers });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "POST only" }), { status: 405, headers });

  let body: { prompt?: string };
  try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: "bad json" }), { status: 400, headers }); }
  const prompt = String(body.prompt || "");
  if (!prompt || prompt.length > 60000) return new Response(JSON.stringify({ error: "prompt missing or too long" }), { status: 400, headers });

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") ?? "",
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 2000, messages: [{ role: "user", content: prompt }] }),
  });
  if (!r.ok) return new Response(JSON.stringify({ error: "ai error", status: r.status }), { status: 502, headers });
  const j = await r.json();
  const text = (j.content || []).map((c: { text?: string }) => c.text || "").join("");
  return new Response(JSON.stringify({ text }), { headers });
});

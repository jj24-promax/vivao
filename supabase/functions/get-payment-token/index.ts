import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const clientId = Deno.env.get("CLIENT_ID");
    const clientSecret = Deno.env.get("CLIENT_SECRET");

    const authHeader = btoa(`${clientId}:${clientSecret}`);
    const response = await fetch("https://api.pixupbr.com/v2/oauth/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), { 
      status: response.status, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
})
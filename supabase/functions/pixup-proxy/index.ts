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

    const { action, body } = await req.json();

    // 1. Obter Token
    const authHeader = btoa(`${clientId}:${clientSecret}`);
    const tokenResponse = await fetch("https://api.pixupbr.com/v2/oauth/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/json"
      }
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) return new Response(JSON.stringify(tokenData), { status: tokenResponse.status, headers: corsHeaders });

    // 2. Preparar Payload
    if (action === 'create_payment') {
      body.amount = Number(body.amount).toFixed(2); // Garante formato "1.00"
      if (!body.payer) {
        body.payer = {
          name: "Teste Dyad",
          document: "12345678909"
        };
      }
    }

    // 3. Chamada API
    const targetUrl = action === 'create_payment' 
      ? "https://api.pixupbr.com/v2/pix/qrcode" 
      : "https://api.pixupbr.com/v2/pix/payment";

    const apiResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const apiData = await apiResponse.json();
    
    if (!apiResponse.ok) {
      return new Response(JSON.stringify({ error: "Erro Pixup", details: apiData }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    return new Response(JSON.stringify(apiData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
})
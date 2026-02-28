import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const clientId = Deno.env.get("CLIENT_ID");
    const clientSecret = Deno.env.get("CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      console.error("[pixup-proxy] Erro: CLIENT_ID ou CLIENT_SECRET não definidos no Supabase.");
      return new Response(JSON.stringify({ 
        error: "Configuração ausente", 
        details: "As Secrets CLIENT_ID ou CLIENT_SECRET não foram encontradas ou estão vazias no painel do Supabase." 
      }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const { action, body } = await req.json();
    console.log(`[pixup-proxy] Iniciando ação: ${action}`);

    // 1. Obter Token OAuth2
    const authHeader = btoa(`${clientId}:${clientSecret}`);
    const tokenResponse = await fetch("https://api.pixupbr.com/v2/oauth/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/json"
      }
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error("[pixup-proxy] Erro na autenticação Pixup:", tokenData);
      return new Response(JSON.stringify({ 
        error: "Falha na autenticação com a Pixup", 
        details: tokenData,
        hint: "Verifique se o CLIENT_ID e CLIENT_SECRET estão corretos e ativos no painel da Pixup."
      }), { 
        status: 401, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const accessToken = tokenData.access_token;

    // 2. Definir Endpoint
    let targetUrl = "";
    if (action === 'create_payment') {
      targetUrl = "https://api.pixupbr.com/v2/pix/qrcode";
    } else if (action === 'make_payment') {
      targetUrl = "https://api.pixupbr.com/v2/pix/payment";
    } else {
      throw new Error(`Ação inválida: ${action}`);
    }

    // 3. Chamada Final
    const apiResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const apiData = await apiResponse.json();
    
    if (!apiResponse.ok) {
      console.error("[pixup-proxy] Erro na API Pixup:", apiData);
    }

    return new Response(JSON.stringify(apiData), {
      status: apiResponse.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("[pixup-proxy] Erro inesperado:", error.message);
    return new Response(JSON.stringify({ error: "Erro interno na Edge Function", message: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
})
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handler para CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const clientId = Deno.env.get("CLIENT_ID");
    const clientSecret = Deno.env.get("CLIENT_SECRET");

    // Log de depuração (não exibe o valor real por segurança)
    console.log("[pixup-proxy] Verificando variáveis de ambiente...");
    if (!clientId) console.error("[pixup-proxy] Erro: CLIENT_ID não encontrado.");
    if (!clientSecret) console.error("[pixup-proxy] Erro: CLIENT_SECRET não encontrado.");

    if (!clientId || !clientSecret) {
      throw new Error("Credenciais da API Pixup não configuradas no Supabase.");
    }

    const { action, body } = await req.json();
    console.log(`[pixup-proxy] Ação solicitada: ${action}`);

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
      console.error("[pixup-proxy] Erro ao obter token:", tokenData);
      return new Response(JSON.stringify({ error: "Falha na autenticação com Pixup", details: tokenData }), { 
        status: tokenResponse.status, 
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
    console.log(`[pixup-proxy] Chamando endpoint: ${targetUrl}`);
    const apiResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const apiData = await apiResponse.json();
    return new Response(JSON.stringify(apiData), {
      status: apiResponse.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("[pixup-proxy] Erro crítico:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
})
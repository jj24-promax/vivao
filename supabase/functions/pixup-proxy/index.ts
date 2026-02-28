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
    const clientId = Deno.env.get("PAYMENT_CLIENT_ID");
    const clientSecret = Deno.env.get("PAYMENT_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      console.error("[pixup-proxy] Erro: Credenciais não configuradas.");
      throw new Error("Configuração de API incompleta.");
    }

    const { action, body } = await req.json();
    console.log(`[pixup-proxy] Executando ação: ${action}`);

    // 1. Obter Token de Acesso (OAuth2)
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
      return new Response(JSON.stringify(tokenData), { 
        status: tokenResponse.status, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const accessToken = tokenData.access_token;

    // 2. Mapeamento de Endpoints conforme solicitado
    let targetUrl = "";
    if (action === 'create_payment') {
      targetUrl = "https://api.pixupbr.com/v2/pix/qrcode"; // Endpoint de QR Code
    } else if (action === 'make_payment') {
      targetUrl = "https://api.pixupbr.com/v2/pix/payment"; // Endpoint de Pagamento
    } else {
      return new Response(JSON.stringify({ error: "Ação inválida" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 3. Chamada para a API Pixup
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
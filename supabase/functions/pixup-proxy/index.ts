import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const clientId = Deno.env.get("PAYMENT_CLIENT_ID");
    const clientSecret = Deno.env.get("PAYMENT_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      console.error("[pixup-proxy] Erro: Credenciais não configuradas no ambiente.");
      throw new Error("Configuração de API incompleta.");
    }

    const { action, body } = await req.json();
    console.log(`[pixup-proxy] Processando ação: ${action}`);

    // 1. Obter Token de Acesso (Sempre necessário para as outras chamadas)
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
      return new Response(JSON.stringify(tokenData), { 
        status: tokenResponse.status, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const accessToken = tokenData.access_token;

    // Se a ação for apenas obter o token
    if (action === 'get_token') {
      return new Response(JSON.stringify({ access_token: accessToken }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Aqui adicionaremos a lógica de 'create_payment' assim que você enviar a documentação
    return new Response(JSON.stringify({ 
      message: "Token gerado com sucesso. Aguardando lógica de pagamento.",
      token_preview: accessToken.substring(0, 20) + "..." 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("[pixup-proxy] Erro interno:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
})
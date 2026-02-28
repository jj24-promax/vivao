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
    const { action, amount, phone, external_id } = await req.json();
    
    // Obtendo o token das Secrets do Supabase
    const FURIA_API_TOKEN = Deno.env.get('FURIA_PAY_TOKEN');
    const BASE_URL = "https://api.furiapay.com.br/api/v1";

    if (!FURIA_API_TOKEN) {
      console.error("[furiapay-payment] Erro: FURIA_PAY_TOKEN não configurado.");
      return new Response(JSON.stringify({ error: 'Configuração do servidor incompleta' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log(`[furiapay-payment] Processando ${action} para ${phone} no valor de ${amount}`);

    if (action === 'create_pix') {
      // Chamada real para o Gateway
      const response = await fetch(`${BASE_URL}/pix`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FURIA_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          amount, 
          external_id, 
          description: `Recarga Vivo ${phone}` 
        })
      });

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    return new Response(JSON.stringify({ error: 'Ação inválida' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });

  } catch (error) {
    console.error("[furiapay-payment] Erro crítico:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
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
    
    // Em produção, use Deno.env.get('FURIA_PAY_TOKEN')
    // Configure no painel do Supabase: Project -> Edge Functions -> Manage Secrets
    const FURIA_API_TOKEN = "SEU_TOKEN_AQUI"; 
    const BASE_URL = "https://api.furiapay.com.br/api/v1";

    console.log(`[furiapay-payment] Processando ${action} para ${phone} no valor de ${amount}`);

    if (action === 'create_pix') {
      // Simulação da chamada real para o Gateway baseada na documentação
      // const response = await fetch(`${BASE_URL}/pix`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${FURIA_API_TOKEN}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ amount, external_id, description: `Recarga Vivo ${phone}` })
      // });
      // const data = await response.json();

      // Mock de resposta para demonstração (substitua pela chamada acima)
      const mockData = {
        id: `tr_${Math.random().toString(36).substr(2, 9)}`,
        pix_code: "00020101021226850014br.gov.bcb.pix0123vivotestepix20250513qrcodepix520400005303986540520.005802BR5925TELEFONICA BRASIL S.A.6009SAO PAULO62070503***6304E1A2",
        status: "pending"
      };

      return new Response(JSON.stringify(mockData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
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
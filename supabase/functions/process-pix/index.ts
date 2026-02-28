import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Lidar com requisições OPTIONS (CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, phoneNumber, description } = await req.json()
    
    // Pegar a chave de API dos Secrets do Supabase
    const apiKey = Deno.env.get('PIXUP_API_KEY')
    
    if (!apiKey) {
      console.error("[process-pix] Erro: PIXUP_API_KEY não configurada nos Secrets.");
      throw new Error("Configuração de API ausente no servidor.")
    }

    console.log(`[process-pix] Iniciando cobrança de R$ ${amount} para ${phoneNumber}`);

    // Chamada para a API da Woovi/OpenPix
    const response = await fetch('https://api.woovi.com/v1/charge', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correlationID: `vivo-${Date.now()}`,
        value: Math.round(parseFloat(amount.replace(',', '.')) * 100), // Converter para centavos
        comment: description || "Recarga Vivo Pré",
        customer: {
          phone: phoneNumber.replace(/\D/g, '')
        }
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[process-pix] Erro na API externa:", data);
      return new Response(JSON.stringify({ error: data.error || "Erro na plataforma de pagamento" }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("[process-pix] Erro inesperado:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
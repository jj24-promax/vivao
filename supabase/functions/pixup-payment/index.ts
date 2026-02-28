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
    console.log("[pixup-payment] Iniciando tentativa de criação de cobrança...");
    
    const body = await req.json();
    const { amount, phone } = body;
    const API_KEY = Deno.env.get('PIXUP_API_KEY');
    
    if (!API_KEY) {
      return new Response(JSON.stringify({ error: "PIXUP_API_KEY não configurada no Supabase." }), { 
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Conversão do valor para centavos (Woovi usa 'value' em centavos)
    const cleanAmount = amount.toString().replace('R$', '').replace(/\s/g, '').replace('.', '').replace(',', '.');
    const valueInCents = Math.round(parseFloat(cleanAmount) * 100);
    const cleanPhone = phone.replace(/\D/g, '');
    const correlationID = `v_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // ENDPOINT CORRETO: /v1/charge (em vez de /v1/pix)
    const baseUrl = "https://api.woovi.com/v1";
    
    console.log(`[pixup-payment] Chamando Woovi: ${baseUrl}/charge`);

    const response = await fetch(`${baseUrl}/charge`, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        value: valueInCents, // Campo correto é 'value'
        correlationID,
        type: 'DYNAMIC',
        comment: `Recarga Vivo - ${cleanPhone}`,
        additionalInfo: [
          { name: 'Telefone', value: cleanPhone }
        ]
      }),
    });

    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("[pixup-payment] Erro da API:", responseData);
        return new Response(JSON.stringify({ 
          error: "Erro na API de Pagamento", 
          details: responseData.error || responseData.message 
        }), { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // A resposta da Woovi para /charge vem dentro do objeto 'charge'
      const charge = responseData.charge;

      return new Response(JSON.stringify({
        transactionId: charge.correlationID,
        copyPasteCode: charge.brCode,
        qrCodeImageUrl: charge.qrCodeImage,
        amount: charge.value / 100,
        expiresAt: charge.expiresDate,
        status: 'PENDING'
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } else {
      const errorText = await response.text();
      console.error("[pixup-payment] Resposta não-JSON recebida. Status:", response.status);
      return new Response(JSON.stringify({ 
        error: "Resposta inesperada do gateway.", 
        status: response.status,
        debug: errorText.substring(0, 200)
      }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

  } catch (error) {
    console.error("[pixup-payment] Erro fatal:", error);
    return new Response(JSON.stringify({ error: "Erro interno", details: error.message }), { 
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
})
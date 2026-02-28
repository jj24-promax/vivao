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
    console.log("[pixup-payment] Iniciando requisição de pagamento...");
    
    const body = await req.json();
    const { amount, phone } = body;
    const API_KEY = Deno.env.get('PIXUP_API_KEY');
    
    if (!API_KEY) {
      console.error("[pixup-payment] ERRO: PIXUP_API_KEY não encontrada.");
      return new Response(JSON.stringify({ error: "Configuração PIXUP_API_KEY ausente." }), { 
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Limpeza e conversão de valores
    const cleanAmount = amount.toString().replace('R$', '').replace(/\s/g, '').replace('.', '').replace(',', '.');
    const valueInCents = Math.round(parseFloat(cleanAmount) * 100);
    const cleanPhone = phone.replace(/\D/g, '');
    const correlationID = `vivo_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // URL CORRETA: Adicionado o prefixo /api/ antes do /v1/
    const baseUrl = "https://api.openpix.com.br";
    const endpoint = `${baseUrl}/api/v1/charge`;
    
    console.log(`[pixup-payment] Chamando endpoint: ${endpoint}`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY.trim(),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        value: valueInCents,
        correlationID,
        type: 'DYNAMIC',
        comment: `Recarga Vivo - ${cleanPhone}`,
        additionalInfo: [
          { name: 'Telefone', value: cleanPhone }
        ]
      }),
    });

    const contentType = response.headers.get("content-type");
    console.log(`[pixup-payment] Status da resposta: ${response.status}`);

    if (contentType && contentType.includes("application/json")) {
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("[pixup-payment] Erro retornado pela API:", responseData);
        return new Response(JSON.stringify({ 
          error: "Erro na API de Pagamento", 
          details: responseData.error || responseData.message || "Erro de validação"
        }), { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

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
      console.error("[pixup-payment] Resposta não-JSON. Status:", response.status);
      console.error("[pixup-payment] Início do conteúdo:", errorText.substring(0, 200));
      
      return new Response(JSON.stringify({ 
        error: `Erro ${response.status}: O servidor de pagamento não reconheceu o caminho.`,
        debug: "Verifique se a URL /api/v1/charge está correta para sua conta."
      }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

  } catch (error) {
    console.error("[pixup-payment] Erro excepcional:", error);
    return new Response(JSON.stringify({ error: "Erro interno", details: error.message }), { 
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
})
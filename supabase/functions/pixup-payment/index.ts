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
      console.error("[pixup-payment] ERRO: PIXUP_API_KEY não encontrada nas variáveis de ambiente.");
      return new Response(JSON.stringify({ error: "Configuração PIXUP_API_KEY ausente." }), { 
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Limpeza e conversão de valores
    const cleanAmount = amount.toString().replace('R$', '').replace(/\s/g, '').replace('.', '').replace(',', '.');
    const valueInCents = Math.round(parseFloat(cleanAmount) * 100);
    const cleanPhone = phone.replace(/\D/g, '');
    const correlationID = `vivo_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Tentando o domínio oficial da OpenPix/Woovi
    const baseUrl = "https://api.openpix.com.br/v1";
    const endpoint = `${baseUrl}/charge`;
    
    console.log(`[pixup-payment] Chamando endpoint: ${endpoint}`);
    console.log(`[pixup-payment] Payload: value=${valueInCents}, correlationID=${correlationID}`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY.trim(), // Garantindo que não haja espaços
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
    console.log(`[pixup-payment] Content-Type: ${contentType}`);

    if (contentType && contentType.includes("application/json")) {
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("[pixup-payment] Erro retornado pela API:", responseData);
        return new Response(JSON.stringify({ 
          error: "Erro na API de Pagamento", 
          details: responseData.error || responseData.message || "Erro desconhecido"
        }), { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Mapeamento do sucesso
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
      console.error("[pixup-payment] Resposta não-JSON. Início do conteúdo:", errorText.substring(0, 300));
      
      return new Response(JSON.stringify({ 
        error: `O gateway retornou status ${response.status} (Não-JSON).`,
        debug: "Verifique se a URL e a API Key estão corretas."
      }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

  } catch (error) {
    console.error("[pixup-payment] Erro excepcional:", error);
    return new Response(JSON.stringify({ error: "Erro interno", details: error.message }), { 
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
})
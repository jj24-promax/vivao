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
      return new Response(JSON.stringify({ error: "Configuração PIXUP_API_KEY ausente no Supabase." }), { 
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Log de segurança: mostra apenas o início da chave para conferência
    console.log(`[pixup-payment] Usando API Key iniciada em: ${API_KEY.substring(0, 8)}...`);

    const cleanAmount = amount.toString().replace('R$', '').replace(/\s/g, '').replace('.', '').replace(',', '.');
    const valueInCents = Math.round(parseFloat(cleanAmount) * 100);
    const cleanPhone = phone.replace(/\D/g, '');
    const correlationID = `vivo_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const endpoint = "https://api.openpix.com.br/api/v1/charge";
    
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

    const responseData = await response.json();
    console.log(`[pixup-payment] Status da resposta: ${response.status}`);

    if (!response.ok) {
      console.error("[pixup-payment] Erro retornado pela API:", JSON.stringify(responseData));
      
      // A OpenPix retorna erros no formato { errors: [{ message: "..." }] }
      const apiErrorMessage = responseData.errors?.[0]?.message || responseData.message || "Erro na API";
      
      return new Response(JSON.stringify({ 
        error: "Erro de Autenticação/Validação", 
        details: apiErrorMessage 
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

  } catch (error) {
    console.error("[pixup-payment] Erro excepcional:", error);
    return new Response(JSON.stringify({ error: "Erro interno", details: error.message }), { 
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
})
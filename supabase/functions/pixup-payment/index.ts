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
    console.log("[pixup-payment] Processando nova requisição...");
    
    const body = await req.json();
    const { amount, phone } = body;
    const API_KEY = Deno.env.get('PIXUP_API_KEY');
    
    if (!API_KEY) {
      console.error("[pixup-payment] ERRO: PIXUP_API_KEY não configurada.");
      return new Response(JSON.stringify({ error: "API Key não configurada no Supabase." }), { 
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const cleanAmount = amount.toString().replace('R$', '').replace(/\s/g, '').replace('.', '').replace(',', '.');
    const amountInCents = Math.round(parseFloat(cleanAmount) * 100);
    const cleanPhone = phone.replace(/\D/g, '');
    const correlationID = `v_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const baseUrl = "https://api.woovi.com/v1";
    
    console.log(`[pixup-payment] Chamando Woovi: ${baseUrl}/pix`);

    const response = await fetch(`${baseUrl}/pix`, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInCents,
        correlationID,
        type: 'DYNAMIC',
        additionalInfo: [
          { name: 'Serviço', value: 'Recarga Vivo' },
          { name: 'Telefone', value: cleanPhone }
        ]
      }),
    });

    // VERIFICAÇÃO CRÍTICA: O que a API respondeu?
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("[pixup-payment] Erro JSON da Woovi:", responseData);
        return new Response(JSON.stringify({ 
          error: "Erro na API de Pagamento", 
          details: responseData.error || responseData.message 
        }), { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      return new Response(JSON.stringify({
        transactionId: responseData.pix.correlationID,
        copyPasteCode: responseData.pix.brCode,
        qrCodeImageUrl: responseData.pix.qrCodeImage,
        amount: responseData.pix.value / 100,
        expiresAt: responseData.pix.expiresDate,
        status: 'PENDING'
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } else {
      // Se não for JSON, lemos como texto para debugar
      const errorText = await response.text();
      console.error("[pixup-payment] A API retornou HTML/Texto em vez de JSON. Status:", response.status);
      console.error("[pixup-payment] Conteúdo da resposta:", errorText.substring(0, 500)); // Loga os primeiros 500 caracteres

      let userMessage = "O gateway de pagamento retornou um erro inesperado (HTML).";
      if (response.status === 401) userMessage = "Chave de API (PIXUP_API_KEY) inválida ou não autorizada.";
      if (response.status === 404) userMessage = "Endpoint da API não encontrado.";

      return new Response(JSON.stringify({ 
        error: userMessage, 
        status: response.status,
        debug: "Verifique os logs do Supabase para ver o HTML retornado."
      }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

  } catch (error) {
    console.error("[pixup-payment] Erro fatal:", error);
    return new Response(JSON.stringify({ error: "Erro interno", details: error.message }), { 
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
})
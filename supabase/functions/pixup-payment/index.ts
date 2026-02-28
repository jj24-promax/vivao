import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Tratamento de CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("[pixup-payment] Iniciando processamento de requisição...");
    
    const body = await req.json();
    const { amount, phone } = body;
    
    // 2. Verificação de Variáveis de Ambiente
    const API_KEY = Deno.env.get('PIXUP_API_KEY');
    
    if (!API_KEY) {
      console.error("[pixup-payment] ERRO CRÍTICO: A variável de ambiente PIXUP_API_KEY não está configurada no Supabase.");
      return new Response(
        JSON.stringify({ 
          error: "Configuração ausente", 
          details: "A PIXUP_API_KEY não foi encontrada nas Secrets do projeto. Configure-a no painel do Supabase." 
        }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Preparação dos dados
    const cleanAmount = amount.toString().replace('R$', '').replace(/\s/g, '').replace('.', '').replace(',', '.');
    const amountInCents = Math.round(parseFloat(cleanAmount) * 100);
    const cleanPhone = phone.replace(/\D/g, '');
    const correlationID = `v_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    console.log(`[pixup-payment] Tentando gerar Pix para ${cleanPhone} no valor de ${amountInCents} centavos.`);

    // 4. Chamada à API Externa com Try/Catch específico
    const baseUrl = "https://api.woovi.com/v1";
    
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

    const responseData = await response.json();

    // 5. Verificação de erro da API externa
    if (!response.ok) {
      console.error("[pixup-payment] A API da Woovi retornou um erro:", responseData);
      return new Response(
        JSON.stringify({ 
          error: "Erro no Gateway de Pagamento", 
          details: responseData.error || responseData.message || "Erro desconhecido na Woovi",
          raw: responseData 
        }), 
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("[pixup-payment] Pix gerado com sucesso!");
    
    return new Response(
      JSON.stringify({
        transactionId: responseData.pix.correlationID,
        copyPasteCode: responseData.pix.brCode,
        qrCodeImageUrl: responseData.pix.qrCodeImage,
        amount: responseData.pix.value / 100,
        expiresAt: responseData.pix.expiresDate,
        status: 'PENDING'
      }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("[pixup-payment] Erro inesperado na execução da função:", error);
    return new Response(
      JSON.stringify({ 
        error: "Erro interno no servidor", 
        details: error.message 
      }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
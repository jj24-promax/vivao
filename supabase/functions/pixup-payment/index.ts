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
    console.log("[pixup-payment] Iniciando requisição Pix Up...");
    
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
    
    // Seguindo o padrão de correlationID do seu PixUpService.ts
    const correlationID = `vivo_${Date.now()}_${cleanPhone}`;

    const endpoint = "https://api.woovi.com/v1/pix";
    console.log(`[pixup-payment] Chamando Pix Up: ${endpoint} | Valor: ${valueInCents} | Phone: ${cleanPhone}`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY.trim(),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        amount: valueInCents,
        correlationID,
        type: 'DYNAMIC',
        additionalInfo: [
          { name: 'Serviço', value: 'Recarga Vivo' },
          { name: 'Telefone', value: cleanPhone }
        ]
      }),
    });

    console.log(`[pixup-payment] Status da Resposta: ${response.status}`);
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("[pixup-payment] Erro retornado pela Pix Up:", responseData);
        return new Response(JSON.stringify({ 
          error: "Erro na Plataforma Pix Up", 
          details: responseData.error || responseData.message || "Falha na requisição"
        }), { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const pix = responseData.pix;
      return new Response(JSON.stringify({
        transactionId: pix.correlationID,
        copyPasteCode: pix.brCode,
        qrCodeImageUrl: pix.qrCodeImage,
        amount: pix.value / 100,
        expiresAt: pix.expiresDate,
        status: 'PENDING'
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    } else {
      // Se não for JSON, captura o texto para depuração
      const errorText = await response.text();
      console.error(`[pixup-payment] Resposta não-JSON recebida (${response.status}):`, errorText.substring(0, 500));
      
      return new Response(JSON.stringify({ 
        error: `Erro ${response.status} na Pix Up`, 
        details: "A plataforma retornou uma página de erro em vez de dados. Verifique se o endpoint ou a chave estão corretos."
      }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

  } catch (error) {
    console.error("[pixup-payment] Erro excepcional:", error);
    return new Response(JSON.stringify({ error: "Erro interno", details: error.message }), { 
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
})
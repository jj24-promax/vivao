import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Interface de resposta padronizada
interface PaymentResponse {
  transactionId: string;
  copyPasteCode: string;
  qrCodeImageUrl: string;
  amount: number;
  expiresAt: string;
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED' | 'FAILED';
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = await req.json();
    const { amount, phone } = body;
    const API_KEY = Deno.env.get('PIXUP_API_KEY');

    if (!API_KEY) {
      console.error("[pixup-payment] Erro: PIXUP_API_KEY não encontrada nos segredos.");
      return new Response(JSON.stringify({ error: "Configuração de API ausente no servidor." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Limpeza e validação do valor (ex: "100,00" -> 10000)
    const cleanAmount = amount.toString().replace('R$', '').replace(/\s/g, '').replace('.', '').replace(',', '.');
    const amountInCents = Math.round(parseFloat(cleanAmount) * 100);

    if (isNaN(amountInCents) || amountInCents <= 0) {
      console.error("[pixup-payment] Valor inválido recebido:", amount);
      return new Response(JSON.stringify({ error: "Valor de recarga inválido." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Gerando um correlationID único e curto
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const cleanPhone = phone.replace(/\D/g, '');
    const correlationID = `v_${Date.now()}_${randomSuffix}`;

    console.log(`[pixup-payment] Criando cobrança: ${correlationID} | Valor: ${amountInCents} cents | Fone: ${cleanPhone}`);

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

    if (!response.ok) {
      console.error("[pixup-payment] Erro API Woovi:", responseData);
      return new Response(JSON.stringify({ 
        error: responseData.error || "Erro na comunicação com o gateway de pagamento." 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    const payment: PaymentResponse = {
      transactionId: responseData.pix.correlationID,
      copyPasteCode: responseData.pix.brCode,
      qrCodeImageUrl: responseData.pix.qrCodeImage,
      amount: responseData.pix.value / 100,
      expiresAt: responseData.pix.expiresDate,
      status: 'PENDING'
    };

    return new Response(JSON.stringify(payment), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("[pixup-payment] Erro inesperado:", error);
    return new Response(JSON.stringify({ error: "Ocorreu um erro interno ao processar o Pix." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentResponse {
  transactionId: string;
  copyPasteCode: string;
  qrCodeImageUrl: string;
  amount: number;
  expiresAt: string;
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED' | 'FAILED';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, phone } = await req.json();
    const API_KEY = Deno.env.get('PIXUP_API_KEY');

    if (!API_KEY) {
      console.error("[pixup-payment] Erro: PIXUP_API_KEY não configurada.");
      throw new Error("Configuração de API ausente.");
    }

    // Limpa o telefone para o correlationID
    const cleanPhone = phone.replace(/\D/g, '');
    const correlationID = `vivo_${Date.now()}_${cleanPhone}`;
    
    // Converte "25,00" -> 2500 (centavos)
    const valueInCents = Math.round(parseFloat(amount.replace(',', '.')) * 100);

    console.log(`[pixup-payment] Gerando Pix: R$ ${amount} (${valueInCents} cents) para ${phone}`);

    const response = await fetch("https://api.woovi.com/v1/pix", {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        value: valueInCents, // O campo correto na Woovi é 'value'
        correlationID: correlationID,
        type: 'DYNAMIC',
        additionalInfo: [
          { name: 'Serviço', value: 'Recarga Vivo' },
          { name: 'Telefone', value: phone }
        ]
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("[pixup-payment] Erro API Woovi:", responseData);
      throw new Error(responseData.error || "Erro no gateway de pagamento.");
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
    console.error("[pixup-payment] Erro crítico:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})
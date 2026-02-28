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
    const { amount, phone } = await req.json();
    const API_KEY = Deno.env.get('PIXUP_API_KEY');

    if (!API_KEY) {
      console.error("[pixup-payment] Erro: PIXUP_API_KEY não encontrada nos segredos.");
      throw new Error("Configuração de API ausente.");
    }

    console.log(`[pixup-payment] Iniciando geração de Pix para ${phone} no valor de ${amount}`);

    // Lógica do Service integrada para evitar erros de importação externa
    const baseUrl = "https://api.woovi.com/v1";
    const correlationID = `vivo_${Date.now()}_${phone.replace(/\D/g, '')}`;
    const amountInCents = Math.round(parseFloat(amount.replace(',', '.')) * 100);

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
          { name: 'Telefone', value: phone }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[pixup-payment] Erro na API PixUp:", errorData);
      throw new Error(errorData.error || "Erro ao gerar cobrança no gateway.");
    }

    const data = await response.json();
    
    const payment: PaymentResponse = {
      transactionId: data.pix.correlationID,
      copyPasteCode: data.pix.brCode,
      qrCodeImageUrl: data.pix.qrCodeImage,
      amount: data.pix.value / 100,
      expiresAt: data.pix.expiresDate,
      status: 'PENDING'
    };

    console.log("[pixup-payment] Pix gerado com sucesso:", payment.transactionId);

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
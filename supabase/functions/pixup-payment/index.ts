import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { PixUpService } from "../../src/services/PixUpService.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { amount, phone } = await req.json();
    const API_KEY = Deno.env.get('PIXUP_API_KEY');

    if (!API_KEY) throw new Error("PIXUP_API_KEY não configurada no Supabase.");

    const pixUp = new PixUpService(API_KEY);
    
    // Converte valor para centavos (ex: "20,00" -> 2000)
    const amountInCents = Math.round(parseFloat(amount.replace(',', '.')) * 100);
    
    const payment = await pixUp.createPixCharge(amountInCents, phone);

    return new Response(JSON.stringify(payment), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("[pixup-payment] Erro:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})
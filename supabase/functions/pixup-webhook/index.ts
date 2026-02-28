import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    const payload = await req.json()
    const { requestBody } = payload
    
    const type = requestBody.transactionType; // RECEIVEPIX ou PAYMENT
    const id = requestBody.transactionId;
    
    console.log(`[pixup-webhook] Evento recebido: ${type} | ID: ${id}`);

    // Lógica para Cash-in (Recebimento PIX)
    if (type === 'RECEIVEPIX' && requestBody.status === 'PAID') {
      await supabase
        .from('payments')
        .update({ 
          status: 'PAID',
          updated_at: new Date().toISOString()
        })
        .eq('transaction_id', id);
    }

    // Lógica para Cash-out (Transferência/Pagamento de saída)
    if (type === 'PAYMENT' && requestBody.statusCode?.statusId === 1) {
      console.log(`[pixup-webhook] Transferência aprovada: ${id}`);
      
      // Aqui você pode atualizar uma tabela de 'transfers' ou 'payouts' se houver
      await supabase
        .from('payments') // Usando a mesma tabela para simplificar, ou uma específica se preferir
        .update({ 
          status: 'COMPLETED',
          updated_at: new Date().toISOString()
        })
        .eq('transaction_id', id);
    }

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });

  } catch (error) {
    console.error("[pixup-webhook] Erro ao processar webhook:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: corsHeaders 
    });
  }
})
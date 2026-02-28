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

  const payload = await req.json()
  const { requestBody } = payload
  
  console.log(`[pixup-webhook] Recebido evento: ${requestBody.transactionId} - Status: ${requestBody.status}`)

  if (requestBody.status === 'PAID') {
    // Atualiza o status do pagamento no banco de dados
    const { error } = await supabase
      .from('payments')
      .update({ 
        status: 'PAID',
        updated_at: new Date().toISOString()
      })
      .eq('transaction_id', requestBody.transactionId)

    if (error) {
      console.error("[pixup-webhook] Erro ao atualizar pagamento:", error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
    }
  }

  return new Response(JSON.stringify({ success: true }), { 
    status: 200, 
    headers: { ...corsHeaders, "Content-Type": "application/json" } 
  })
})
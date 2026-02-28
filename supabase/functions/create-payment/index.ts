import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    const { name, email, phone, amount, document_number } = await req.json();
    
    // Garante que o valor seja um número e depois formata como string "0.00"
    const formattedAmount = Number(amount).toFixed(2);
    const cleanCPF = document_number.replace(/\D/g, "");

    // 1. Salvar Lead
    const { data: lead, error: leadErr } = await supabase
      .from('leads')
      .insert({ name, email, phone, document_number: cleanCPF })
      .select()
      .single();
    if (leadErr) throw leadErr;

    // 2. Criar Transação PENDING
    const { data: transaction, error: transErr } = await supabase
      .from('transactions')
      .insert({ lead_id: lead.id, amount: Number(formattedAmount), status: 'PENDING' })
      .select()
      .single();
    if (transErr) throw transErr;

    // 3. Obter Token
    const tokenRes = await fetch("https://rvjycrapllupubyieqae.supabase.co/functions/v1/get-payment-token", {
      method: "POST"
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) throw new Error("Falha ao obter token de acesso");

    // 4. Gerar QR Code na Pixup
    const pixPayload = {
      amount: formattedAmount, // Enviando como string "XX.XX"
      payerQuestion: `Recarga Vivo - ${phone}`,
      external_id: transaction.id,
      postbackUrl: "https://rvjycrapllupubyieqae.supabase.co/functions/v1/payment-webhook",
      payer: {
        name: name,
        document: cleanCPF
      }
    };

    console.log("[create-payment] Enviando para Pixup:", JSON.stringify(pixPayload));

    const pixRes = await fetch("https://api.pixupbr.com/v2/pix/qrcode", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(pixPayload)
    });

    const pixData = await pixRes.json();
    
    if (!pixRes.ok) {
      console.error("[create-payment] Erro Pixup:", JSON.stringify(pixData));
      // Retornamos o erro detalhado da Pixup para o frontend
      return new Response(JSON.stringify({ 
        error: "Erro na API Pixup", 
        details: pixData 
      }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // 5. Atualizar Transação
    await supabase
      .from('transactions')
      .update({ 
        gateway_transaction_id: pixData.transactionId,
        raw_gateway_response: pixData 
      })
      .eq('id', transaction.id);

    return new Response(JSON.stringify({
      transactionId: transaction.id,
      qrcode: pixData.qrcode,
      expiration: pixData.calendar?.expiration || 3600
    }), { 
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });

  } catch (error) {
    console.error("[create-payment] Erro interno:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
})
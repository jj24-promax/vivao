import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTransactionStatus = (transactionId: string | null) => {
  const [status, setStatus] = useState<'PENDING' | 'PAID' | 'FAILED' | null>(null);

  useEffect(() => {
    if (!transactionId) return;

    // 1. Busca inicial
    const fetchStatus = async () => {
      const { data } = await supabase
        .from('transactions')
        .select('status')
        .eq('id', transactionId)
        .single();
      if (data) setStatus(data.status as any);
    };
    fetchStatus();

    // 2. Escuta em tempo real (Mais eficiente que polling)
    const channel = supabase
      .channel(`transaction-${transactionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'transactions',
          filter: `id=eq.${transactionId}`,
        },
        (payload) => {
          setStatus(payload.new.status);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [transactionId]);

  return status;
};
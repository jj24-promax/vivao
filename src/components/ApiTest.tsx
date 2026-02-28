"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Terminal } from "lucide-react";
import { callPixupAPI } from '@/utils/payment';
import { supabase } from "@/integrations/supabase/client";

const ApiTest = () => {
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [pixupStatus, setPixupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<any>(null);

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        // Verificando a tabela transactions que acabamos de criar
        const { error } = await supabase.from('transactions').select('count').limit(1);
        if (error) throw error;
        setSupabaseStatus('connected');
      } catch (err) {
        console.error("Erro ao conectar com Supabase:", err);
        setSupabaseStatus('error');
      }
    };
    checkSupabase();
  }, []);

  const runPixupTest = async () => {
    setPixupStatus('loading');
    setResponse(null);
    
    try {
      const data = await callPixupAPI('create_payment', {
        amount: 1.00,
        payerQuestion: "Teste Dyad",
        external_id: `test_${Date.now()}`
      });
      
      setResponse(data);
      setPixupStatus('success');
    } catch (error: any) {
      try {
        const parsedError = JSON.parse(error.message);
        setResponse(parsedError);
      } catch {
        setResponse({ error: error.message });
      }
      setPixupStatus('error');
    }
  };

  return (
    <section className="container mx-auto px-4 py-12 border-t border-dashed border-gray-200">
      <Card className="max-w-2xl mx-auto border-2 border-gray-100 shadow-none">
        <CardHeader className="bg-gray-50/50 border-b">
          <CardTitle className="text-lg font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={20} className="text-gray-500" />
              Diagnóstico de API
            </div>
            <div className="flex items-center gap-2 text-xs font-normal">
              Status DB: 
              <span className={supabaseStatus === 'connected' ? 'text-green-600' : 'text-red-600'}>
                {supabaseStatus === 'connected' ? 'Conectado' : 'Erro'}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <Button 
            onClick={runPixupTest} 
            disabled={pixupStatus === 'loading'}
            className="w-full h-12 bg-[#660099] hover:bg-[#550080] text-white font-bold"
          >
            {pixupStatus === 'loading' ? <Loader2 className="animate-spin" /> : "Testar Conexão Pixup"}
          </Button>

          {response && (
            <div className={`p-4 rounded-lg border ${pixupStatus === 'success' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <p className={`font-bold text-sm mb-2 ${pixupStatus === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                Resposta da API:
              </p>
              <pre className="text-[10px] overflow-x-auto p-2 bg-white/50 rounded">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default ApiTest;
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertTriangle, Terminal, Database } from "lucide-react";
import { callPixupAPI } from '@/utils/payment';
import { supabase } from "@/integrations/supabase/client";

const ApiTest = () => {
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [pixupStatus, setPixupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<any>(null);

  // Verifica conexão com Supabase ao carregar
  useEffect(() => {
    const checkSupabase = async () => {
      try {
        // Tenta uma operação simples no Supabase
        const { data, error } = await supabase.from('payments').select('count').limit(1);
        if (error) throw error;
        setSupabaseStatus('connected');
      } catch (err) {
        console.error("Erro Supabase:", err);
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
        payerQuestion: "Teste de Conexão Dyad",
        external_id: `test_${Date.now()}`
      });
      
      setResponse(data);
      if (data.qrcode || data.transactionId) {
        setPixupStatus('success');
      } else {
        setPixupStatus('error');
      }
    } catch (error: any) {
      setResponse({ error: error.message });
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
              Status da Integração
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <Database size={14} />
              Supabase: 
              {supabaseStatus === 'checking' && <span className="text-gray-400">Verificando...</span>}
              {supabaseStatus === 'connected' && <span className="text-green-600 flex items-center gap-1"><CheckCircle size={12} /> Conectado</span>}
              {supabaseStatus === 'error' && <span className="text-red-600 flex items-center gap-1"><AlertTriangle size={12} /> Erro de Tabela</span>}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {supabaseStatus === 'error' && (
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800">
              <strong>Nota:</strong> Se o status do Supabase estiver em "Erro de Tabela", certifique-se de ter executado o comando SQL para criar a tabela <code>payments</code> no seu painel do Supabase.
            </div>
          )}

          <p className="text-sm text-gray-600">
            Teste a comunicação entre o Frontend -> Edge Function -> API Pixup.
          </p>
          
          <Button 
            onClick={runPixupTest} 
            disabled={pixupStatus === 'loading'}
            className="w-full h-12 bg-[#660099] hover:bg-[#550080] text-white font-bold"
          >
            {pixupStatus === 'loading' ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testando API...</>
            ) : "Testar Geração de PIX"}
          </Button>

          {pixupStatus === 'success' && (
            <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex items-start gap-3">
              <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-green-800 font-bold text-sm">API Pixup Conectada!</p>
                <pre className="mt-3 p-2 bg-white/50 rounded text-[10px] overflow-x-auto max-h-32">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {pixupStatus === 'error' && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
              <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-red-800 font-bold text-sm">Erro na API Pixup</p>
                <p className="text-red-700 text-xs mt-1">Verifique as Secrets (CLIENT_ID e SECRET) no Supabase.</p>
                <pre className="mt-3 p-2 bg-white/50 rounded text-[10px] overflow-x-auto text-red-600">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default ApiTest;
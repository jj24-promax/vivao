"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertTriangle, Terminal } from "lucide-react";
import { callPixupAPI } from '@/utils/payment';

const ApiTest = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<any>(null);

  const runTest = async () => {
    setStatus('loading');
    setResponse(null);
    
    try {
      // Tenta gerar um QR Code de teste de R$ 1,00
      const data = await callPixupAPI('create_payment', {
        amount: 1.00,
        payerQuestion: "Teste de Conexão Dyad",
        external_id: `test_${Date.now()}`
      });
      
      setResponse(data);
      if (data.qrcode || data.transactionId) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error: any) {
      console.error("Erro no teste:", error);
      setResponse({ error: error.message });
      setStatus('error');
    }
  };

  return (
    <section className="container mx-auto px-4 py-12 border-t border-dashed border-gray-200">
      <Card className="max-w-2xl mx-auto border-2 border-gray-100 shadow-none">
        <CardHeader className="bg-gray-50/50">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Terminal size={20} className="text-gray-500" />
            Painel de Teste da API Pixup
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <p className="text-sm text-gray-600">
            Este botão enviará uma requisição para sua Edge Function <code className="bg-gray-100 px-1 rounded">pixup-proxy</code> para validar as credenciais e a geração de QR Code.
          </p>
          
          <Button 
            onClick={runTest} 
            disabled={status === 'loading'}
            className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold"
          >
            {status === 'loading' ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testando...</>
            ) : "Testar Conexão Agora"}
          </Button>

          {status === 'success' && (
            <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex items-start gap-3">
              <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-green-800 font-bold text-sm">Conexão bem-sucedida!</p>
                <p className="text-green-700 text-xs mt-1">A API respondeu corretamente e gerou um ID de transação.</p>
                <pre className="mt-3 p-2 bg-white/50 rounded text-[10px] overflow-x-auto max-h-32">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
              <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-red-800 font-bold text-sm">Erro na conexão</p>
                <p className="text-red-700 text-xs mt-1">Verifique se as Secrets (CLIENT_ID e SECRET) estão configuradas no Supabase.</p>
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
"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Copy, CheckCircle2, Smartphone, ArrowRight } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from "@/integrations/supabase/client";
import { useTransactionStatus } from '@/hooks/useTransactionStatus';
import { showError } from '@/utils/toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
}

const PaymentModal = ({ isOpen, onClose, amount }: PaymentModalProps) => {
  const [view, setView] = useState<'FORM' | 'LOADING' | 'QR_CODE' | 'SUCCESS' | 'ERROR'>('FORM');
  const [phone, setPhone] = useState('');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  
  const transactionStatus = useTransactionStatus(paymentData?.transactionId);

  useEffect(() => {
    if (transactionStatus === 'PAID') setView('SUCCESS');
  }, [transactionStatus]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setView('FORM');
        setPaymentData(null);
        setPhone('');
      }, 300);
    }
  }, [isOpen]);

  const handlePhoneFormat = (v: string) => {
    const n = v.replace(/\D/g, "");
    if (n.length <= 2) return `(${n}`;
    if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
    return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7, 11)}`;
  };

  const handleSubmit = async () => {
    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 11) {
      showError("Informe um número de telefone válido com DDD.");
      return;
    }

    setView('LOADING');
    try {
      // Enviamos dados genéricos para Nome, Email e CPF para satisfazer a API
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          name: 'Cliente Vivo',
          email: 'cliente@recarga.com',
          phone: cleanPhone, 
          document_number: '12345678909', // CPF genérico para a API
          amount: parseFloat(amount.replace(',', '.')) 
        }
      });

      if (error) throw error;
      setPaymentData(data);
      setView('QR_CODE');
    } catch (err: any) {
      showError(err.message || "Erro ao processar pagamento.");
      setView('FORM');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-3xl border-none">
        <div className="bg-[#660099] p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              {view === 'FORM' ? 'Dados da Recarga' : view === 'QR_CODE' ? 'Pague com PIX' : 'Status'}
            </DialogTitle>
            <DialogDescription className="text-purple-100 opacity-90">
              {view === 'FORM' ? 'Informe o número para recarga.' : 'Escaneie o código abaixo.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8">
          {view === 'FORM' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Número Vivo com DDD</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#660099]" size={22} />
                  <Input 
                    className="pl-12 h-16 text-xl font-medium border-gray-200 focus:border-[#660099] focus:ring-[#660099] rounded-2xl" 
                    placeholder="(00) 90000-0000" 
                    value={phone}
                    onChange={e => setPhone(handlePhoneFormat(e.target.value))}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleSubmit} 
                className="w-full h-16 bg-[#660099] hover:bg-[#550080] text-white font-bold text-lg rounded-2xl shadow-lg shadow-purple-200 transition-all active:scale-95"
              >
                Gerar PIX de R$ {amount} <ArrowRight className="ml-2" size={20} />
              </Button>
              
              <p className="text-center text-xs text-gray-400">
                Ao continuar, você concorda com os termos de recarga da Vivo.
              </p>
            </div>
          )}

          {view === 'LOADING' && (
            <div className="py-12 flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-[#660099] animate-spin" />
              <p className="text-gray-500 font-medium">Gerando seu QR Code...</p>
            </div>
          )}

          {view === 'QR_CODE' && (
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl shadow-inner border border-gray-100 mb-6">
                <QRCodeSVG value={paymentData?.qrcode || ""} size={220} />
              </div>
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(paymentData.qrcode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="w-full h-14 bg-[#660099] text-white font-bold rounded-xl mb-4"
              >
                {copied ? <CheckCircle2 className="mr-2" /> : <Copy className="mr-2" />}
                {copied ? "Copiado!" : "Copiar Código PIX"}
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                <Loader2 className="w-4 h-4 animate-spin text-[#660099]" /> 
                <span>Aguardando confirmação do pagamento...</span>
              </div>
            </div>
          )}

          {view === 'SUCCESS' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-2xl font-bold">Recarga Confirmada!</h3>
              <p className="text-gray-500">Os créditos serão enviados para {phone} em instantes.</p>
              <Button onClick={onClose} className="w-full h-14 bg-[#660099] text-white font-bold rounded-xl">Fechar</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
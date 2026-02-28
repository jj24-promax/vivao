"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Copy, CheckCircle2, Smartphone, Mail, User, CreditCard, ArrowRight } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from "@/integrations/supabase/client";
import { useTransactionStatus } from '@/hooks/useTransactionStatus';
import { showSuccess, showError } from '@/utils/toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
}

const PaymentModal = ({ isOpen, onClose, amount }: PaymentModalProps) => {
  const [view, setView] = useState<'FORM' | 'LOADING' | 'QR_CODE' | 'SUCCESS' | 'ERROR'>('FORM');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', document: '' });
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
        setFormData({ name: '', email: '', phone: '', document: '' });
      }, 300);
    }
  }, [isOpen]);

  const handlePhoneFormat = (v: string) => {
    const n = v.replace(/\D/g, "");
    if (n.length <= 2) return `(${n}`;
    if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
    return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7, 11)}`;
  };

  const handleCPFFormat = (v: string) => {
    const n = v.replace(/\D/g, "");
    if (n.length <= 3) return n;
    if (n.length <= 6) return `${n.slice(0, 3)}.${n.slice(3)}`;
    if (n.length <= 9) return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`;
    return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9, 11)}`;
  };

  const handleSubmit = async () => {
    const cleanPhone = formData.phone.replace(/\D/g, "");
    const cleanCPF = formData.document.replace(/\D/g, "");

    if (!formData.name || !formData.email || cleanPhone.length !== 11 || cleanCPF.length !== 11) {
      showError("Preencha todos os campos corretamente (incluindo CPF).");
      return;
    }

    setView('LOADING');
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          ...formData, 
          document_number: cleanCPF,
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
              {view === 'FORM' ? 'Informe seus dados para continuar.' : 'Escaneie o código abaixo.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8">
          {view === 'FORM' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    className="pl-10 h-12" 
                    placeholder="Seu nome" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">CPF</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    className="pl-10 h-12" 
                    placeholder="000.000.000-00" 
                    value={formData.document}
                    onChange={e => setFormData({...formData, document: handleCPFFormat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    className="pl-10 h-12" 
                    placeholder="seu@email.com" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Número Vivo</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    className="pl-10 h-12" 
                    placeholder="(00) 90000-0000" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: handlePhoneFormat(e.target.value)})}
                  />
                </div>
              </div>
              <Button onClick={handleSubmit} className="w-full h-14 bg-[#660099] hover:bg-[#550080] text-white font-bold rounded-xl mt-4">
                Gerar PIX de R$ {amount} <ArrowRight className="ml-2" size={18} />
              </Button>
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
                <QRCodeSVG value={paymentData?.qrcode || ""} size={200} />
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
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Aguardando pagamento...
              </p>
            </div>
          )}

          {view === 'SUCCESS' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-2xl font-bold">Recarga Confirmada!</h3>
              <p className="text-gray-500">Os créditos serão enviados para {formData.phone} em instantes.</p>
              <Button onClick={onClose} className="w-full h-14 bg-[#660099] text-white font-bold rounded-xl">Fechar</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
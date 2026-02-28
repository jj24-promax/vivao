"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Smartphone, Copy, ShieldCheck, AlertTriangle } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import type { PaymentResponse } from "@/services/PixUpService";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planValue: string;
}

const CheckoutModal = ({ isOpen, onClose, planValue }: CheckoutModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'pix_ready' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setPhoneNumber("");
        setStatus('idle');
        setPaymentData(null);
        setErrorMessage("");
        setErrorDetails("");
      }, 300);
    }
  }, [isOpen]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(formatPhone(e.target.value));
  };

  const isPhoneValid = phoneNumber.replace(/\D/g, "").length === 11;

  const handleGeneratePix = async () => {
    if (!isPhoneValid) return;
    
    setStatus('loading');
    setErrorMessage("");
    setErrorDetails("");
    
    try {
      const { data, error } = await supabase.functions.invoke('pixup-payment', {
        body: { amount: planValue, phone: phoneNumber }
      });

      // Se o Supabase retornar erro (ex: 500 ou 400), o 'error' virá preenchido
      if (error) {
        // Tenta extrair o JSON de erro se houver
        let details = "Erro desconhecido";
        try {
          const errorBody = await error.context.json();
          details = errorBody.details || errorBody.error || error.message;
        } catch (e) {
          details = error.message;
        }
        throw new Error(details);
      }

      if (data?.error) throw new Error(data.details || data.error);

      setPaymentData(data);
      setStatus('pix_ready');
      showSuccess("Pix gerado com sucesso!");
    } catch (err: any) {
      console.error("[CheckoutModal] Erro capturado:", err);
      setErrorMessage("Falha ao gerar pagamento");
      setErrorDetails(err.message);
      setStatus('error');
    }
  };

  const copyToClipboard = () => {
    if (paymentData?.copyPasteCode) {
      navigator.clipboard.writeText(paymentData.copyPasteCode);
      showSuccess("Código copiado!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-[#660099] p-8 text-white relative">
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
            <ShieldCheck size={12} /> Conexão Segura
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-light text-white">
              Recarga de <span className="font-bold">R$ {planValue}</span>
            </DialogTitle>
            <DialogDescription className="text-purple-100 opacity-90">
              {status === 'pix_ready' ? 'Pagamento via Pix' : 'Finalize sua recarga'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8">
          {(status === 'idle' || status === 'error') && (
            <div className="space-y-6">
              {status === 'error' && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex flex-col gap-1 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle size={16} />
                    <span>{errorMessage}</span>
                  </div>
                  <p className="text-xs opacity-80 ml-6">{errorDetails}</p>
                </div>
              )}
              
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Smartphone size={14} className="text-[#660099]" />
                  Número Vivo para Recarga
                </label>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="(00) 90000-0000"
                  className="h-16 text-xl border-gray-200 rounded-2xl bg-gray-50 focus:ring-[#660099]"
                />
              </div>
              <Button
                onClick={handleGeneratePix}
                disabled={!isPhoneValid}
                className="w-full h-16 bg-[#660099] hover:bg-[#550080] text-white font-bold text-lg rounded-2xl shadow-lg transition-all active:scale-95"
              >
                {status === 'error' ? 'Tentar Novamente' : 'Gerar Pix'}
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="py-12 flex flex-col items-center gap-4 animate-in fade-in">
              <Loader2 className="h-12 w-12 text-[#660099] animate-spin" />
              <div className="text-center">
                <p className="text-gray-900 font-bold">Processando...</p>
                <p className="text-gray-400 text-sm">Comunicando com o banco</p>
              </div>
            </div>
          )}

          {status === 'pix_ready' && paymentData && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95">
              <div className="flex justify-center bg-white p-4 rounded-2xl border-2 border-gray-50 shadow-inner">
                <img src={paymentData.qrCodeImageUrl} alt="QR Code Pix" className="w-48 h-48" />
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={copyToClipboard}
                  variant="outline"
                  className="w-full h-14 border-2 border-[#660099] text-[#660099] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-purple-50"
                >
                  <Copy size={18} /> Copiar Código Pix
                </Button>
                <p className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">
                  O bônus será liberado automaticamente após o pagamento
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
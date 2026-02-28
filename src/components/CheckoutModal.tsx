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
import { Loader2, Smartphone, Copy } from "lucide-react";
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
  const [status, setStatus] = useState<'idle' | 'loading' | 'pix_ready' | 'success'>('idle');
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setPhoneNumber("");
        setStatus('idle');
        setPaymentData(null);
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
    
    try {
      const { data, error } = await supabase.functions.invoke('pixup-payment', {
        body: { amount: planValue, phone: phoneNumber }
      });

      // Se houver erro na chamada da função
      if (error) {
        const errorMsg = error.message || "Erro de conexão com o servidor";
        throw new Error(errorMsg);
      }

      // Se a função retornou um erro no corpo do JSON
      if (data?.error) {
        throw new Error(data.error);
      }

      setPaymentData(data);
      setStatus('pix_ready');
      showSuccess("Pix gerado com sucesso!");
    } catch (err: any) {
      console.error("[CheckoutModal] Erro:", err);
      showError(err.message || "Erro ao gerar Pix. Tente novamente.");
      setStatus('idle');
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
          <DialogHeader>
            <DialogTitle className="text-2xl font-light text-white">
              Recarga de <span className="font-bold">R$ {planValue}</span>
            </DialogTitle>
            <DialogDescription className="text-purple-100 opacity-90">
              {status === 'pix_ready' ? 'Escaneie o QR Code ou copie o código' : 'Informe o número para recarregar'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8">
          {status === 'idle' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Smartphone size={14} className="text-[#660099]" />
                  Número Vivo
                </label>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="(00) 90000-0000"
                  className="h-16 text-xl border-gray-200 rounded-2xl bg-gray-50"
                />
              </div>
              <Button
                onClick={handleGeneratePix}
                disabled={!isPhoneValid}
                className="w-full h-16 bg-[#660099] hover:bg-[#550080] text-white font-bold text-lg rounded-2xl shadow-lg"
              >
                Gerar Pix
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="py-12 flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 text-[#660099] animate-spin" />
              <p className="text-gray-500 font-medium">Gerando sua cobrança...</p>
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
                  className="w-full h-14 border-2 border-[#660099] text-[#660099] font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <Copy size={18} /> Copiar Código Pix
                </Button>
                <p className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">
                  O bônus será liberado após o pagamento
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
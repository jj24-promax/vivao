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
import { Loader2, CheckCircle2, Smartphone } from "lucide-react";
import { showSuccess } from "@/utils/toast";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planValue: string;
}

const CheckoutModal = ({ isOpen, onClose, planValue }: CheckoutModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setPhoneNumber("");
        setStatus('idle');
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
    const formatted = formatPhone(e.target.value);
    setPhoneNumber(formatted);
  };

  const isPhoneValid = phoneNumber.replace(/\D/g, "").length === 11;

  const handleConfirm = async () => {
    if (!isPhoneValid) return;
    
    setStatus('loading');
    
    // Simulação de processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStatus('success');
    showSuccess("Solicitação de recarga enviada!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-[#660099] p-8 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl font-light text-white">
              Recarga de <span className="font-bold">R$ {planValue}</span>
            </DialogTitle>
            <DialogDescription className="text-purple-100 opacity-90 text-base">
              {status === 'success' ? 'Solicitação concluída' : 'Informe o número para receber os créditos'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8">
          {status === 'idle' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-600 flex items-center gap-2 uppercase tracking-wider">
                  <Smartphone size={16} className="text-[#660099]" />
                  Número Vivo com DDD
                </label>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  className="h-16 text-xl border-gray-200 focus:ring-[#660099] focus:border-[#660099] rounded-2xl bg-gray-50/50"
                  autoFocus
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
                <div className="bg-blue-500 p-1 rounded-full text-white mt-0.5">
                  <CheckCircle2 size={14} />
                </div>
                <p className="text-sm text-blue-800 leading-tight">
                  Você receberá <span className="font-bold">Bônus de Internet</span> imediatamente após a confirmação.
                </p>
              </div>

              <Button
                onClick={handleConfirm}
                disabled={!isPhoneValid}
                className="w-full h-16 bg-[#660099] hover:bg-[#550080] text-white font-bold text-lg rounded-2xl transition-all shadow-lg shadow-purple-100 active:scale-[0.98]"
              >
                Confirmar Recarga
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="py-16 flex flex-col items-center justify-center space-y-6 text-center">
              <Loader2 className="h-16 w-16 text-[#660099] animate-spin" />
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-800">Processando...</p>
                <p className="text-gray-500">Estamos validando sua solicitação.</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6 py-4 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="flex justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle2 size={48} className="text-green-600" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-800">Tudo pronto!</p>
                <p className="text-gray-500">
                  Sua solicitação de recarga para o número <span className="font-bold text-gray-700">{phoneNumber}</span> foi enviada com sucesso.
                </p>
              </div>
              <Button 
                onClick={onClose}
                className="w-full h-14 bg-[#660099] hover:bg-[#550080] text-white font-bold rounded-2xl"
              >
                Fechar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
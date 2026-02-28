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
import { Loader2, CheckCircle2, Smartphone, Copy, QrCode } from "lucide-react";
import { showSuccess } from "@/utils/toast";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planValue: string;
}

const CheckoutModal = ({ isOpen, onClose, planValue }: CheckoutModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [pixCode] = useState("00020101021226850014br.gov.bcb.pix0123vivotestepix20250513qrcodepix520400005303986540520.005802BR5925TELEFONICA BRASIL S.A.6009SAO PAULO62070503***6304E1A2");

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setPhoneNumber("");
        setStatus('idle');
      }, 300);
    }
  }, [isOpen]);

  // Formatação manual do telefone: (99) 99999-9999
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

  const handlePixGeneration = async () => {
    if (!isPhoneValid) return;
    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStatus('success');
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    showSuccess("Código Pix copiado com sucesso!");
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
              {status === 'success' ? 'Pagamento via Pix' : 'Informe o número para receber os créditos'}
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
                  Você receberá <span className="font-bold">Bônus de Internet</span> imediatamente após a confirmação do pagamento.
                </p>
              </div>

              <Button
                onClick={handlePixGeneration}
                disabled={!isPhoneValid}
                className="w-full h-16 bg-[#660099] hover:bg-[#550080] text-white font-bold text-lg rounded-2xl transition-all shadow-lg shadow-purple-100 active:scale-[0.98]"
              >
                Gerar Código Pix
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="py-16 flex flex-col items-center justify-center space-y-6 text-center">
              <div className="relative">
                <Loader2 className="h-16 w-16 text-[#660099] animate-spin" />
                <QrCode className="h-6 w-6 text-[#660099] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-800">Gerando seu Pix...</p>
                <p className="text-gray-500 max-w-[250px] mx-auto">Estamos preparando seu código de pagamento seguro.</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm">
                  <div className="w-48 h-48 bg-gray-50 flex items-center justify-center relative overflow-hidden rounded-lg">
                    <QrCode size={160} className="text-gray-800" strokeWidth={1.5} />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-pulse" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Escaneie o QR Code acima com o app do seu banco ou use o código abaixo.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Pix Copia e Cola</p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 truncate text-sm text-gray-600 font-mono">
                    {pixCode}
                  </div>
                  <Button 
                    onClick={copyPixCode}
                    className="bg-[#660099] hover:bg-[#550080] text-white p-3 h-auto rounded-xl"
                  >
                    <Copy size={20} />
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Button 
                  onClick={onClose}
                  variant="ghost"
                  className="w-full h-12 text-gray-400 hover:text-gray-600 font-medium"
                >
                  Cancelar e voltar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
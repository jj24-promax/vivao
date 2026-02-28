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
import InputMask from 'react-input-mask';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planValue: string;
}

const CheckoutModal = ({ isOpen, onClose, planValue }: CheckoutModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setPhoneNumber("");
        setStatus('idle');
      }, 300);
    }
  }, [isOpen]);

  const isPhoneValid = phoneNumber.replace(/\D/g, "").length === 11;

  const handlePixGeneration = async () => {
    if (!isPhoneValid) return;

    setStatus('loading');
    console.log(`Gerando Pix para o plano R$ ${planValue} e número ${phoneNumber}`);

    // Simulação de 2 segundos
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setStatus('success');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl p-0 overflow-hidden border-none">
        <div className="bg-[#660099] p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-light text-white">
              Você escolheu a recarga de <span className="font-bold">R$ {planValue}</span>
            </DialogTitle>
            <DialogDescription className="text-purple-100 opacity-90">
              Informe o número Vivo que receberá os créditos.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6">
          {status === 'idle' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Smartphone size={16} className="text-[#660099]" />
                  Número do Celular
                </label>
                <InputMask
                  mask="(99) 99999-9999"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                >
                  {(inputProps: any) => (
                    <Input
                      {...inputProps}
                      type="tel"
                      placeholder="(00) 00000-0000"
                      className="h-14 text-lg border-gray-200 focus:ring-[#660099] focus:border-[#660099] rounded-xl"
                      autoFocus
                    />
                  )}
                </InputMask>
              </div>

              <Button
                onClick={handlePixGeneration}
                disabled={!isPhoneValid}
                className="w-full h-14 bg-[#660099] hover:bg-[#550080] text-white font-bold text-lg rounded-xl transition-all active:scale-[0.98]"
              >
                Continuar para o Pagamento
              </Button>
            </>
          )}

          {status === 'loading' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <Loader2 className="h-12 w-12 text-[#660099] animate-spin" />
              <div className="space-y-1">
                <p className="text-xl font-bold text-gray-800">Gerando Pix...</p>
                <p className="text-gray-500">Aguarde um instante enquanto preparamos seu código.</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center space-y-6 text-center animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-800">Pix Gerado!</p>
                <p className="text-gray-600">
                  O código de pagamento foi enviado para o número <br />
                  <span className="font-bold text-gray-900">{phoneNumber}</span>
                </p>
              </div>
              <Button 
                onClick={onClose}
                variant="outline"
                className="w-full h-12 border-gray-200 text-gray-600 font-bold rounded-xl"
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
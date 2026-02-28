"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Copy, CheckCircle2, Smartphone, QrCode } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { generatePixCharge, PixResponse } from "@/services/paymentService";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
}

const CheckoutModal = ({ isOpen, onClose, amount }: CheckoutModalProps) => {
  const [step, setStep] = useState<'phone' | 'pix'>('phone');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pixData, setPixData] = useState<PixResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length === 0) return "";
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneSubmit = async () => {
    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.length < 11) {
      showError("Digite um número válido com DDD");
      return;
    }

    setIsLoading(true);
    try {
      const data = await generatePixCharge(amount, phoneNumber);
      setPixData(data);
      setStep('pix');
    } catch (err: any) {
      showError(err.message || "Erro ao gerar Pix. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (pixData?.charge.qrCodeStaticCode) {
      navigator.clipboard.writeText(pixData.charge.qrCodeStaticCode);
      setCopied(true);
      showSuccess("Código Pix copiado!");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl p-0 overflow-hidden border-none">
        <div className="bg-[#660099] p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {step === 'phone' ? <Smartphone size={24} /> : <QrCode size={24} />}
              {step === 'phone' ? 'Confirmar Número' : 'Pagamento Pix'}
            </DialogTitle>
          </DialogHeader>
          <p className="text-purple-100 text-sm mt-1">
            Recarga de <span className="font-bold">R$ {amount}</span>
          </p>
        </div>

        <div className="p-8 bg-white">
          {step === 'phone' ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Número Vivo com DDD</label>
                <Input 
                  placeholder="(00) 90000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
                  className="h-14 text-lg border-gray-200 focus:ring-[#660099]"
                />
              </div>
              <Button 
                onClick={handlePhoneSubmit}
                disabled={isLoading}
                className="w-full h-14 bg-[#660099] hover:bg-[#550080] text-white font-bold text-lg rounded-xl"
              >
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Gerar Pix'}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200">
                <img 
                  src={pixData?.charge.qrCodeImage} 
                  alt="QR Code Pix" 
                  className="w-48 h-48"
                />
              </div>
              
              <div className="w-full space-y-3">
                <p className="text-sm text-gray-500 font-medium">Escaneie o QR Code ou copie o código abaixo:</p>
                <Button 
                  variant="outline"
                  onClick={copyToClipboard}
                  className={`w-full h-14 border-2 font-bold text-base rounded-xl transition-all ${copied ? 'border-green-500 text-green-600 bg-green-50' : 'border-[#660099] text-[#660099] hover:bg-purple-50'}`}
                >
                  {copied ? (
                    <><CheckCircle2 className="mr-2" size={20} /> Código Copiado!</>
                  ) : (
                    <><Copy className="mr-2" size={20} /> Copiar Código Pix</>
                  )}
                </Button>
              </div>

              <p className="text-[11px] text-gray-400 leading-tight">
                Após o pagamento, sua recarga será processada instantaneamente.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
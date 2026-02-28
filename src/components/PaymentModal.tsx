"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Copy, CheckCircle2, Smartphone, AlertCircle, ArrowRight } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { callPixupAPI } from '@/utils/payment';
import { showSuccess, showError } from '@/utils/toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
}

const PaymentModal = ({ isOpen, onClose, amount }: PaymentModalProps) => {
  const [step, setStep] = useState<'phone' | 'pix'>('phone');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Resetar ao fechar
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('phone');
        setPaymentData(null);
        setPhoneNumber("");
      }, 300);
    }
  }, [isOpen]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length === 0) return "";
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneSubmit = async () => {
    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.length !== 11) {
      showError("Digite um número válido com DDD");
      return;
    }

    setLoading(true);
    try {
      const numericAmount = parseFloat(amount.replace(',', '.'));
      
      // Configuração do Split (Ajuste os usernames conforme sua conta Pixup)
      const splitConfig = [
        {
          username: "usertest", // Substitua pelo username real do destinatário do split
          percentageSplit: "10"  // 10% de comissão/split
        }
      ];

      const data = await callPixupAPI('create_payment', {
        amount: numericAmount,
        payerQuestion: `Recarga Vivo - ${phoneNumber}`,
        external_id: `vivo_${Date.now()}`,
        split: splitConfig // Adicionando o objeto de split
      });
      
      if (data.qrcode) {
        setPaymentData(data);
        setTimeLeft(data.calendar?.expiration || 3000);
        setStep('pix');
      } else {
        showError(data.message || "Erro ao gerar PIX.");
      }
    } catch (error) {
      showError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const copyToClipboard = () => {
    if (paymentData?.qrcode) {
      navigator.clipboard.writeText(paymentData.qrcode);
      setCopied(true);
      showSuccess("Código PIX copiado!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-3xl border-none">
        <div className="bg-[#660099] p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Smartphone className="w-6 h-6" />
              {step === 'phone' ? 'Informe seu número' : 'Finalizar Recarga'}
            </DialogTitle>
            <DialogDescription className="text-purple-100 opacity-90">
              {step === 'phone' 
                ? 'Precisamos do seu número para creditar a recarga.' 
                : 'Escaneie o QR Code ou copie o código para pagar.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 flex flex-col items-center">
          {step === 'phone' ? (
            <div className="w-full space-y-6">
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
                disabled={loading || phoneNumber.replace(/\D/g, "").length !== 11}
                className="w-full h-14 bg-[#660099] hover:bg-[#550080] text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Continuar <ArrowRight size={20} /></>}
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Valor da Recarga</p>
                <p className="text-4xl font-bold text-gray-900">R$ {amount}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-inner border border-gray-100 mb-6">
                <QRCodeSVG value={paymentData?.qrcode || ""} size={200} level="H" />
              </div>

              <div className="w-full space-y-4">
                <Button 
                  onClick={copyToClipboard}
                  className="w-full h-14 bg-[#660099] hover:bg-[#550080] text-white font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? "Copiado!" : "Copiar Código PIX"}
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>Expira em: <span className="font-bold text-red-500">{formatTime(timeLeft)}</span></span>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
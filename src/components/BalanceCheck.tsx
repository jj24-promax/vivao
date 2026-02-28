"use client";

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import InfoTooltip from './InfoTooltip';
import CancellationAlert from './CancellationAlert';

const BalanceCheck = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Formatação: (XX) 9XXXX-XXXX
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length === 0) return "";
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numbers = rawValue.replace(/\D/g, "");
    
    if (numbers.length <= 11) {
      setPhoneNumber(formatPhone(numbers));
    }
  };

  // Validação em tempo real
  useEffect(() => {
    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.length > 0 && digits.length < 11) {
      setError("O número deve ter 11 dígitos (DDD + 9 + número)");
    } else if (digits.length === 11 && digits[2] !== '9') {
      setError("Formato inválido: o número deve começar com 9 após o DDD");
    } else {
      setError(null);
    }
  }, [phoneNumber]);

  const digits = phoneNumber.replace(/\D/g, "");
  const isPhoneValid = digits.length === 11 && digits[2] === '9';

  const handleConsult = async () => {
    if (!isPhoneValid) return;

    setIsLoading(true);
    setBalance(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setBalance("R$ 0,00");
    showSuccess("Consulta realizada com sucesso!");
  };

  return (
    <section id="balance-check" className="container mx-auto px-4 py-16 border-t border-gray-100 scroll-mt-24">
      <div className="max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img 
              src="/consultar-saldo-icon.png" 
              alt="Saldo" 
              className="w-14 h-14 object-contain" 
            />
          </div>
          <h3 className="text-3xl font-light text-gray-800">Consulte seu saldo grátis</h3>
        </div>
        
        <p className="text-gray-500 text-base mb-8">
          Digite seu número Vivo e receba uma mensagem com seu saldo disponível.
        </p>
        
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-4 max-w-md">
            <div className="flex-1 relative">
              <Input 
                type="text"
                placeholder="(00) 90000-0000" 
                value={phoneNumber}
                onChange={handleInputChange}
                className={`h-14 border-gray-300 focus:ring-[#660099] text-lg ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
            </div>
            <Button 
              onClick={handleConsult}
              disabled={isLoading || !isPhoneValid}
              className="bg-[#660099] hover:bg-[#550080] text-white font-bold h-14 px-10 text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Consultando
                </>
              ) : (
                "Consultar"
              )}
            </Button>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {balance && (
          <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="p-6 bg-purple-50 border border-purple-100 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-[#660099] font-bold uppercase tracking-wider">Saldo Disponível</p>
                <InfoTooltip />
              </div>
              <p className="text-4xl font-light text-gray-900">{balance}</p>
            </div>
            
            <CancellationAlert />
          </div>
        )}
      </div>
    </section>
  );
};

export default BalanceCheck;
"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

const BalanceCheck = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      setPhoneNumber(value);
    }
  };

  const handleConsult = async () => {
    if (phoneNumber.length < 11) {
      showError("Por favor, insira o número completo com DDD (11 dígitos).");
      return;
    }

    setIsLoading(true);
    setBalance(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setBalance("R$ 0,00");
    showSuccess("Consulta realizada com sucesso!");
  };

  const scrollToRecharge = () => {
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <section className="container mx-auto px-4 py-16 border-t border-gray-100">
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
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-md">
          <Input 
            type="text"
            inputMode="numeric"
            placeholder="DDD + Celular Vivo" 
            value={phoneNumber}
            onChange={handleInputChange}
            className="h-14 border-gray-300 focus:ring-[#660099] text-lg"
          />
          <Button 
            onClick={handleConsult}
            disabled={isLoading}
            className="bg-[#660099] hover:bg-[#550080] text-white font-bold h-14 px-10 text-lg transition-all"
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

        {balance && (
          <div className="mt-8 p-6 bg-purple-50 border border-purple-100 rounded-xl animate-in fade-in slide-in-from-top-4 duration-500">
            <p className="text-sm text-[#660099] font-bold uppercase tracking-wider mb-1">Saldo Disponível</p>
            <p className="text-4xl font-light text-gray-900">{balance}</p>
            
            {/* Mensagem de Alerta Condicional em Vermelho */}
            {balance === "R$ 0,00" && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-red-800 text-sm font-medium bg-red-50/50 p-3 rounded-lg border border-red-100">
                <AlertCircle size={18} className="shrink-0 text-red-600" />
                <span>Recarregue antes que a linha seja cancelada</span>
                <button 
                  onClick={scrollToRecharge}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-900 rounded-full border border-red-200 font-bold hover:bg-red-200 hover:shadow-sm transition-all active:scale-95 group"
                >
                  clique aqui
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}

            <p className="text-[10px] text-gray-400 mt-6 italic">
              *Este é um valor simulado para o número {phoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")}.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BalanceCheck;
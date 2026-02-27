"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BalanceCheck = () => {
  return (
    <section className="container mx-auto px-4 py-16 border-t border-gray-100">
      <div className="max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <img src="/consultar-saldo-icon.png" alt="Saldo" className="w-12 h-12 object-contain" />
          <h3 className="text-2xl font-light text-gray-800">Consulte seu saldo grátis</h3>
        </div>
        
        <p className="text-gray-500 text-sm mb-6">
          Digite seu número Vivo e receba uma mensagem com seu saldo disponível.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-md">
          <Input 
            placeholder="DDD + Celular Vivo" 
            className="h-12 border-gray-300 focus:ring-[#660099]"
          />
          <Button className="bg-[#660099] hover:bg-[#550080] text-white font-bold h-12 px-8">
            Consultar
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BalanceCheck;
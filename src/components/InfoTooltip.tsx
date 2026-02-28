"use client";

import React from 'react';
import { AlertCircle } from 'lucide-react';

const InfoTooltip = () => {
  return (
    <div className="group relative inline-block">
      {/* Gatilho: Ícone de (!) em um círculo */}
      <div className="cursor-help text-red-500 hover:text-red-600 transition-colors p-1">
        <AlertCircle size={20} strokeWidth={2.5} />
      </div>
      
      {/* Balão flutuante (Tooltip) */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block w-[280px] sm:w-[300px] z-50 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#1A1A1A] text-white text-[13px] leading-relaxed p-4 rounded-xl shadow-2xl relative border border-white/10">
          <p>
            Se a linha for cancelada, você pode perder o número, ficar sem chamadas/SMS/internet, e não conseguir receber códigos de verificação (WhatsApp, bancos e apps). Em alguns casos, o número pode ser repassado para outra pessoa.
          </p>
          {/* Seta do balão */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#1A1A1A]" />
        </div>
      </div>
    </div>
  );
};

export default InfoTooltip;
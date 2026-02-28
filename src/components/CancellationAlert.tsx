"use client";

import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';

const CancellationAlert = () => {
  const scrollToRecharge = () => {
    const element = document.getElementById('recharge-offers');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="mt-4 p-4 bg-[#FFF5F5] border border-[#FED7D7] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex items-center gap-3">
        <AlertCircle className="text-[#C53030] shrink-0" size={20} />
        <p className="text-[#9B2C2C] text-sm font-medium">
          Recarregue antes que a linha seja cancelada
        </p>
      </div>
      
      <button 
        onClick={scrollToRecharge}
        className="flex items-center gap-2 bg-[#FFF5F5] border border-[#FEB2B2] hover:bg-[#FED7D7] text-[#C53030] font-bold py-2 px-5 rounded-full text-sm transition-all active:scale-95 whitespace-nowrap"
      >
        clique aqui <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default CancellationAlert;
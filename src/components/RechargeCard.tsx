"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import CheckoutModal from './CheckoutModal';

interface RechargeCardProps {
  value: string;
  bonus: string;
  showAppsBonus?: boolean;
}

const RechargeCard = ({ value, bonus, showAppsBonus = false }: RechargeCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group h-full">
        <div className="mb-2">
          <h3 className="text-[42px] font-bold text-gray-900 tracking-tight">R$ {value}</h3>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Oferta Vivo Pré*</p>
        </div>
        
        <div className="mt-6 mb-8 space-y-1 flex-1 flex flex-col justify-center">
          <p className="text-2xl font-bold text-gray-900">
            <span className="text-[#660099]">{bonus}</span> de bônus
          </p>
          {showAppsBonus && (
            <p className="text-sm font-medium text-gray-500">
              Whatsapp e Instagram Grátis
            </p>
          )}
        </div>
        
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#660099] hover:bg-[#550080] text-white font-bold py-7 px-10 rounded-xl w-full text-lg shadow-lg shadow-purple-100 transition-all active:scale-95"
        >
          Recarregue
        </Button>
      </div>

      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        planValue={value} 
      />
    </>
  );
};

export default RechargeCard;
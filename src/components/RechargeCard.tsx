"use client";

import React from 'react';
import { Button } from "@/components/ui/button";

interface RechargeCardProps {
  value: string;
  bonus: string;
}

const RechargeCard = ({ value, bonus }: RechargeCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 flex flex-col items-center text-center min-w-[250px] flex-1 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h3 className="text-4xl font-bold text-black">R$ {value}</h3>
        <p className="text-sm text-gray-600 mt-1">Oferta Vivo Pré*</p>
      </div>
      
      <div className="mb-8">
        <p className="text-2xl font-bold text-black">{bonus} de bônus</p>
      </div>
      
      <Button className="bg-[#660099] hover:bg-[#550080] text-white font-bold py-3 px-8 rounded-md w-full sm:w-auto">
        Recarregue
      </Button>
    </div>
  );
};

export default RechargeCard;
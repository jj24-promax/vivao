"use client";

import React from 'react';
import { Button } from "@/components/ui/button";

interface RechargeCardProps {
  value: string;
  bonus: string;
}

const RechargeCard = ({ value, bonus }: RechargeCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col min-w-[250px] flex-1 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h3 className="text-3xl font-light text-gray-800">R$ {value}</h3>
        <p className="text-xs text-gray-500 mt-1">Oferta Vivo Pré*</p>
      </div>
      
      <div className="mb-8">
        <p className="text-2xl font-light text-gray-800">{bonus} de bônus</p>
      </div>
      
      <Button className="bg-[#D8245C] hover:bg-[#b01d4a] text-white font-medium py-2 px-4 rounded w-fit">
        Recarregue
      </Button>
    </div>
  );
};

export default RechargeCard;
"use client";

import React from 'react';
import RechargeCard from './RechargeCard';

const RechargeSection = () => {
  const offers = [
    { value: '20,00', bonus: '2GB' },
    { value: '25,00', bonus: '3GB' },
    { value: '30,00', bonus: '5GB' },
    { value: '17,00', bonus: '500MB' },
  ];

  return (
    <section className="container mx-auto px-4 py-10 sm:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl font-light text-black leading-tight mb-4 px-2">
          Faça sua recarga de celular e ganhe bônus de internet
        </h2>
        <a href="#" className="text-[#660099] text-sm sm:text-base font-medium hover:underline">
          Ver todos os valores
        </a>
      </div>
      
      {/* Grid que vira scroll lateral no mobile ou empilha melhor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {offers.map((offer, index) => (
          <RechargeCard key={index} value={offer.value} bonus={offer.bonus} />
        ))}
      </div>
      
      <div className="flex justify-center mt-8 sm:mt-12 gap-2">
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#660099]"></div>
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gray-300"></div>
      </div>
    </section>
  );
};

export default RechargeSection;
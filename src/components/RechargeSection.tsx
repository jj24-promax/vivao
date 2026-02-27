"use client";

import React from 'react';
import RechargeCard from './RechargeCard';

const RechargeSection = () => {
  const offers = [
    { value: '20,00', bonus: '1GB' },
    { value: '25,00', bonus: '2GB' },
    { value: '30,00', bonus: '5GB' },
    { value: '17,00', bonus: '500MB' },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-light text-black leading-tight mb-4">
          Faça sua recarga de celular e ganhe bônus de internet
        </h2>
        <a href="#" className="text-[#660099] text-base font-medium hover:underline">
          Ver todos os valores
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {offers.map((offer, index) => (
          <RechargeCard key={index} value={offer.value} bonus={offer.bonus} />
        ))}
      </div>
      
      <div className="flex justify-center mt-12 gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#660099]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
      </div>
    </section>
  );
};

export default RechargeSection;
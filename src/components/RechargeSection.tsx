"use client";

import React, { useRef } from 'react';
import RechargeCard from './RechargeCard';

const RechargeSection = () => {
  const cardsRef = useRef<HTMLDivElement>(null);

  const offers = [
    { value: '20,00', bonus: '2GB' },
    { value: '25,00', bonus: '3GB' },
    { value: '30,00', bonus: '5GB' },
    { value: '17,00', bonus: '500MB' },
  ];

  const scrollToOffers = (e: React.MouseEvent) => {
    e.preventDefault();
    cardsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-5xl font-light text-gray-900 leading-tight mb-6">
          Faça sua recarga de celular e <br className="hidden sm:block" />
          <span className="font-normal">ganhe bônus de internet</span>
        </h2>
        <button 
          onClick={scrollToOffers}
          className="text-[#660099] text-base font-bold hover:underline cursor-pointer bg-transparent border-none p-0 flex items-center gap-2 mx-auto"
        >
          Ver todos os valores
        </button>
      </div>
      
      <div 
        id="recharge-offers"
        ref={cardsRef} 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 scroll-mt-24"
      >
        {offers.map((offer, index) => (
          <RechargeCard key={index} value={offer.value} bonus={offer.bonus} />
        ))}
      </div>
      
      <div className="flex justify-center mt-12 gap-3">
        <div className="w-3 h-3 rounded-full bg-[#660099]"></div>
        <div className="w-3 h-3 rounded-full bg-gray-200"></div>
        <div className="w-3 h-3 rounded-full bg-gray-200"></div>
      </div>
    </section>
  );
};

export default RechargeSection;
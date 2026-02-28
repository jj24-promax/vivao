"use client";

import React, { useRef, useState, useEffect } from 'react';
import RechargeCard from './RechargeCard';

const RechargeSection = () => {
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  // Atualiza a bolinha ativa baseada no scroll (apenas mobile)
  const handleScroll = () => {
    if (cardsRef.current && window.innerWidth < 768) {
      const scrollLeft = cardsRef.current.scrollLeft;
      const cardWidth = cardsRef.current.offsetWidth * 0.85; // 85% é a largura do card no mobile
      const index = Math.round(scrollLeft / cardWidth);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    }
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
      
      {/* Container com scroll horizontal no mobile e grid no desktop */}
      <div 
        id="recharge-offers"
        ref={cardsRef} 
        onScroll={handleScroll}
        className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 scroll-mt-24 pb-4"
      >
        {offers.map((offer, index) => (
          <div 
            key={index} 
            className="min-w-[85%] sm:min-w-0 snap-center"
          >
            <RechargeCard value={offer.value} bonus={offer.bonus} />
          </div>
        ))}
      </div>
      
      {/* Indicadores de página (bolinhas) visíveis apenas no mobile */}
      <div className="flex md:hidden justify-center mt-8 gap-3">
        {offers.map((_, index) => (
          <div 
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeIndex === index ? 'bg-[#660099] w-6' : 'bg-gray-200'
            }`}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default RechargeSection;
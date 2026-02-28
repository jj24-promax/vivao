"use client";

import React, { useRef, useState } from 'react';
import PaymentModal from './PaymentModal';

const RechargeSection = () => {
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState("");

  const offers = [
    { value: '20,00', bonus: '2GB', apps: '' },
    { value: '25,00', bonus: '3GB', apps: '' },
    { value: '30,00', bonus: '5GB', apps: 'Whatsapp e Instagram Grátis' },
    { value: '50,00', bonus: '10GB', apps: 'Whatsapp e Instagram Grátis' },
    { 
      value: '100,00', 
      bonus: '30GB', 
      apps: 'Whatsapp, Instagram, TikTok e YouTube Grátis',
      highlight: true 
    },
    { 
      value: '150,00', 
      bonus: '60GB', 
      apps: 'Whatsapp, Instagram, TikTok, YouTube e Netflix Grátis',
      highlight: false 
    },
  ];

  const handleRechargeClick = (value: string) => {
    setSelectedAmount(value);
    setIsModalOpen(true);
  };

  const scrollToOffers = (e: React.MouseEvent) => {
    e.preventDefault();
    cardsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleScroll = () => {
    if (cardsRef.current && window.innerWidth < 768) {
      const scrollLeft = cardsRef.current.scrollLeft;
      const cardWidth = cardsRef.current.offsetWidth * 0.85;
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
      
      <div 
        id="recharge-offers"
        ref={cardsRef} 
        onScroll={handleScroll}
        className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 scroll-mt-24 pb-4"
      >
        {offers.map((offer, index) => (
          <div 
            key={index} 
            className="min-w-[85%] sm:min-w-0 snap-center"
          >
            <div className={`bg-white border ${offer.highlight ? 'border-[#660099] ring-2 ring-[#660099]/10' : 'border-gray-100'} rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] h-full relative`}>
              {offer.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#660099] text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                  Melhor Custo-Benefício
                </div>
              )}
              <div className="mb-2">
                <h3 className="text-[42px] font-bold text-gray-900 tracking-tight">R$ {offer.value}</h3>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Oferta Vivo Pré*</p>
              </div>
              <div className="mt-6 mb-8 space-y-2 flex-1 flex flex-col justify-center">
                <p className="text-2xl font-bold text-gray-900">
                  <span className="text-[#660099]">{offer.bonus}</span> de bônus
                </p>
                {offer.apps && (
                  <p className="text-sm font-medium text-gray-500 leading-tight">
                    {offer.apps}
                  </p>
                )}
              </div>
              <button 
                onClick={() => handleRechargeClick(offer.value)}
                className="bg-[#660099] hover:bg-[#550080] text-white font-bold py-4 px-10 rounded-xl w-full text-lg transition-all active:scale-95"
              >
                Recarregue
              </button>
            </div>
          </div>
        ))}
      </div>
      
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

      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        amount={selectedAmount} 
      />
    </section>
  );
};

export default RechargeSection;
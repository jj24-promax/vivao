"use client";

import React from 'react';
import { Button } from "@/components/ui/button";

const WhatsAppSection = () => {
  const handleRecarregue = () => {
    const element = document.getElementById('recharge-offers');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="container mx-auto px-4 py-20 border-t border-gray-100">
      <div className="flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <p className="text-[#660099] font-bold text-sm tracking-widest uppercase">RECARGA RÁPIDA EM 3 PASSOS</p>
          <h2 className="text-3xl md:text-4xl font-light text-gray-800 leading-tight">
            Recarregue no WhatsApp, ganhe bônus de internet e muito mais!
          </h2>
          
          <div className="space-y-4">
            <p className="text-gray-600 text-base">Use o WhatsApp Vivo para recarregar seu celular. E também:</p>
            <ul className="space-y-3 text-gray-600 text-base list-disc pl-5">
              <li>Conferir seu saldo</li>
              <li>Ver seu consumo de internet</li>
              <li>Ativar ou antecipar promoção Vivo Turbo e muito mais.</li>
            </ul>
          </div>
          
          <p className="text-gray-600 text-base pt-4">
            Adicione e converse no número <span className="underline font-semibold">(11) 99915-1515</span> ou clique aqui:
          </p>
          
          <Button 
            onClick={handleRecarregue}
            className="bg-[#660099] hover:bg-[#550080] text-white font-bold px-10 py-7 rounded-md text-base"
          >
            Recarregue
          </Button>
        </div>
        
        <div className="flex-1 flex justify-center">
          <img 
            src="/whatsapp-section.webp" 
            alt="WhatsApp Vivo" 
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default WhatsAppSection;
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";

const WhatsAppSection = () => {
  return (
    <section className="container mx-auto px-4 py-16 border-t border-gray-100">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <p className="text-[#660099] font-bold text-xs tracking-widest uppercase">RECARGA RÁPIDA EM 3 PASSOS</p>
          <h2 className="text-3xl md:text-4xl font-light text-gray-800 leading-tight">
            Recarregue no WhatsApp, ganhe bônus de internet e muito mais!
          </h2>
          
          <p className="text-gray-500 text-sm">Use o WhatsApp Vivo para recarregar seu celular. E também:</p>
          <ul className="space-y-2 text-gray-500 text-sm list-disc pl-5">
            <li>Conferir seu saldo</li>
            <li>Ver seu consumo de internet</li>
            <li>Ativar ou antecipar promoção Vivo Turbo e muito mais.</li>
          </ul>
          
          <p className="text-gray-500 text-sm pt-4">
            Adicione e converse no número <span className="underline font-medium">(11) 99915-1515</span> ou clique aqui:
          </p>
          
          <Button className="bg-[#660099] hover:bg-[#550080] text-white font-bold px-8 py-6 rounded-md text-sm">
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
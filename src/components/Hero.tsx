"use client";

import React from 'react';
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="w-full bg-[#F2F2F2]">
      <div className="container mx-auto">
        <div className="relative w-full overflow-hidden">
          {/* Usando object-cover para evitar deformação e mantendo uma altura mínima responsiva */}
          <img 
            src="/vivo-banner.png" 
            alt="Banner Vivo Pré" 
            className="w-full h-auto min-h-[200px] object-cover md:object-contain block"
          />
          
          {/* Posicionamento dos botões sobre a imagem */}
          <div className="absolute bottom-[10%] left-[5%] md:left-[12%] flex gap-2 md:gap-4">
            <Button className="bg-[#D8245C] hover:bg-[#b01d4a] text-white font-bold px-4 md:px-8 py-4 md:py-6 rounded-md text-xs md:text-sm shadow-lg transition-all">
              Meu número
            </Button>
            <Button className="bg-white hover:bg-gray-100 text-[#660099] font-bold px-4 md:px-8 py-4 md:py-6 rounded-md text-xs md:text-sm border border-gray-200 shadow-lg transition-all">
              Outro número
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
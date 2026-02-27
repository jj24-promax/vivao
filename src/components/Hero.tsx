"use client";

import React from 'react';
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="w-full bg-white">
      <div className="relative w-full overflow-hidden">
        {/* Imagem do banner */}
        <img 
          src="/vivo-banner.png" 
          alt="Banner Vivo Pré" 
          className="w-full h-auto block min-h-[180px] object-cover sm:object-contain"
        />
        
        {/* Container de botões responsivo */}
        <div className="absolute bottom-[8%] left-0 w-full px-4 sm:px-0 sm:left-[10%] lg:left-[15%] flex flex-row gap-2 sm:gap-4 justify-center sm:justify-start">
          <Button className="bg-[#D8245C] hover:bg-[#b01d4a] text-white font-bold h-9 sm:h-12 px-4 sm:px-8 rounded-md text-[10px] sm:text-sm shadow-lg transition-all flex-1 sm:flex-none max-w-[140px] sm:max-w-none">
            Meu número
          </Button>
          <Button className="bg-white hover:bg-gray-100 text-[#660099] font-bold h-9 sm:h-12 px-4 sm:px-8 rounded-md text-[10px] sm:text-sm border border-gray-200 shadow-lg transition-all flex-1 sm:flex-none max-w-[140px] sm:max-w-none">
            Outro número
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
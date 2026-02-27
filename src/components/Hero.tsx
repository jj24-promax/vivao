"use client";

import React from 'react';
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="w-full relative overflow-hidden">
      <div className="w-full h-[400px] md:h-[500px] relative">
        <img 
          src="/vivo-banner.png" 
          alt="Banner Vivo Pré" 
          className="w-full h-full object-cover"
        />
        
        {/* Overlay buttons as seen in the screenshot */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center md:justify-start md:left-20 gap-4 px-4">
          <Button className="bg-[#D8245C] hover:bg-[#b01d4a] text-white font-bold px-8 py-6 rounded-md text-sm">
            Meu número
          </Button>
          <Button className="bg-white hover:bg-gray-100 text-[#660099] font-bold px-8 py-6 rounded-md text-sm border border-gray-200">
            Outro número
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
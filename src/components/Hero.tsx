"use client";

import React from 'react';
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="w-full relative overflow-hidden bg-[#F2F2F2]">
      <div className="container mx-auto relative">
        <div className="w-full h-[250px] md:h-[350px] relative">
          <img 
            src="/vivo-banner.png" 
            alt="Banner Vivo Pré" 
            className="w-full h-full object-cover md:object-fill"
          />
          
          {/* Overlay buttons positioned exactly like the site */}
          <div className="absolute bottom-6 left-4 md:bottom-12 md:left-12 flex gap-3">
            <Button className="bg-[#D8245C] hover:bg-[#b01d4a] text-white font-bold px-6 py-5 rounded-md text-sm shadow-lg">
              Meu número
            </Button>
            <Button className="bg-white hover:bg-gray-100 text-[#660099] font-bold px-6 py-5 rounded-md text-sm border border-gray-200 shadow-lg">
              Outro número
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
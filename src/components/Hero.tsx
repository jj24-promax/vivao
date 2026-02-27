"use client";

import React from 'react';

const Hero = () => {
  return (
    <section className="w-full bg-white">
      <div className="relative w-full overflow-hidden">
        {/* Imagem do banner agora sem botões sobrepostos */}
        <img 
          src="/vivo-banner.png" 
          alt="Banner Vivo Pré" 
          className="w-full h-auto block min-h-[180px] object-cover sm:object-contain"
        />
      </div>
    </section>
  );
};

export default Hero;
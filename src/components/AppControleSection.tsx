"use client";

import React from 'react';

const AppControleSection = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* App Vivo Card */}
        <div className="bg-[#660099] rounded-lg p-8 flex justify-between items-center text-white overflow-hidden relative min-h-[220px]">
          <div className="z-10 space-y-4 pr-28 md:pr-32">
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-80">APP VIVO</p>
            <h3 className="text-xl font-light leading-tight">
              No App Vivo você recarrega, ganha bônus de internet e faz muito mais!
            </h3>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-24 md:w-28">
            <img 
              src="/app-vivo-icon.webp" 
              alt="App Vivo" 
              className="w-full h-auto object-contain" 
            />
          </div>
        </div>

        {/* Vivo Controle Card */}
        <div className="bg-[#660099] rounded-lg p-8 flex justify-between items-center text-white overflow-hidden relative min-h-[220px]">
          <div className="z-10 space-y-4 pr-28 md:pr-32">
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-80">VIVO CONTROLE</p>
            <h3 className="text-xl font-light leading-tight">
              Troque já seu plano e garanta ainda mais benefícios!
            </h3>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-24 md:w-28">
            <img 
              src="/vivo-pay-icon.webp" 
              alt="Vivo Controle" 
              className="w-full h-auto object-contain" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppControleSection;
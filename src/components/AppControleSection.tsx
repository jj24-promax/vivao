"use client";

import React from 'react';

const AppControleSection = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* App Vivo Card */}
        <div className="bg-[#660099] rounded-lg p-8 flex justify-between items-center text-white overflow-hidden relative group cursor-pointer min-h-[200px]">
          <div className="z-10 space-y-4">
            <p className="text-xs font-bold tracking-widest uppercase opacity-80">APP VIVO</p>
            <h3 className="text-xl font-light leading-tight max-w-[200px]">
              No App Vivo você recarrega, ganha bônus de internet e faz muito mais!
            </h3>
            <p className="text-sm font-bold underline mt-4">Confira</p>
          </div>
          <div className="absolute right-4 bottom-0 w-32 md:w-40 transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <img src="/app-vivo-icon.webp" alt="App Vivo" className="w-full h-auto" />
          </div>
        </div>

        {/* Vivo Controle Card */}
        <div className="bg-[#660099] rounded-lg p-8 flex justify-between items-center text-white overflow-hidden relative group cursor-pointer min-h-[200px]">
          <div className="z-10 space-y-4">
            <p className="text-xs font-bold tracking-widest uppercase opacity-80">VIVO CONTROLE</p>
            <h3 className="text-xl font-light leading-tight max-w-[200px]">
              Troque já seu plano e garanta ainda mais benefícios!
            </h3>
            <p className="text-sm font-bold underline mt-4">Confira</p>
          </div>
          <div className="absolute right-4 bottom-0 w-32 md:w-40 transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <img src="/vivo-pay-icon.webp" alt="Vivo Controle" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppControleSection;
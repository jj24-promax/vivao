"use client";

import React from 'react';
import { Smartphone, ShieldCheck } from 'lucide-react';

const AppControleSection = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* App Vivo Card */}
        <div className="bg-[#660099] rounded-lg p-8 flex justify-between items-center text-white overflow-hidden relative group cursor-pointer">
          <div className="z-10 space-y-4">
            <p className="text-xs font-bold tracking-widest uppercase opacity-80">APP VIVO</p>
            <h3 className="text-xl font-light leading-tight max-w-[200px]">
              No App Vivo você recarrega, ganha bônus de internet e faz muito mais!
            </h3>
            <p className="text-sm font-bold underline mt-4">Confira</p>
          </div>
          <div className="bg-yellow-400 p-4 rounded-2xl rotate-12 group-hover:rotate-0 transition-transform">
            <Smartphone size={60} className="text-[#660099]" />
          </div>
        </div>

        {/* Vivo Controle Card */}
        <div className="bg-[#660099] rounded-lg p-8 flex justify-between items-center text-white overflow-hidden relative group cursor-pointer">
          <div className="z-10 space-y-4">
            <p className="text-xs font-bold tracking-widest uppercase opacity-80">VIVO CONTROLE</p>
            <h3 className="text-xl font-light leading-tight max-w-[200px]">
              Troque já seu plano e garanta ainda mais benefícios!
            </h3>
            <p className="text-sm font-bold underline mt-4">Confira</p>
          </div>
          <div className="bg-red-500 p-4 rounded-2xl -rotate-12 group-hover:rotate-0 transition-transform">
            <ShieldCheck size={60} className="text-white" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppControleSection;
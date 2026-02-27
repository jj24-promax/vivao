"use client";

import React from 'react';
import { Button } from "@/components/ui/button";

const ScheduledRecharge = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Text Content */}
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl md:text-4xl font-light text-gray-800 leading-tight">
            Recarga Programada com <br />
            <span className="font-normal">10GB de bônus todo mês</span> é só na Vivo!
          </h2>
          
          <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
            Na Recarga Programada da Vivo você define o valor e o dia que quer receber sua recarga, 
            e recebe todo mês seus créditos e 10GB de bônus sem precisar se preocupar. 
            Você ainda pode editar ou cancelar sua programada sem custos a qualquer momento pelos canais da Vivo.
          </p>
          
          <div className="pt-4 space-y-4">
            <p className="text-gray-700 font-semibold text-sm">Programar recarga para:</p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-[#660099] hover:bg-[#550080] text-white font-bold px-8 py-6 rounded-md text-sm">
                Meu número
              </Button>
              <Button variant="outline" className="border-[#660099] text-[#660099] hover:bg-purple-50 font-bold px-8 py-6 rounded-md text-sm">
                Outro número
              </Button>
            </div>
          </div>
        </div>
        
        {/* Illustration */}
        <div className="flex-1 flex justify-center">
          <img 
            src="/scheduled-recharge-bg.png" 
            alt="Ilustração Recarga Programada" 
            className="max-w-full h-auto"
          />
        </div>
      </div>
      
      <div className="mt-20">
        <h3 className="text-3xl font-light text-gray-800">
          Saiba mais canais onde sua recarga também garante bônus
        </h3>
      </div>
    </section>
  );
};

export default ScheduledRecharge;
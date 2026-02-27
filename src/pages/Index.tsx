"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import RechargeSection from '@/components/RechargeSection';
import PaymentMethods from '@/components/PaymentMethods';
import ScheduledRecharge from '@/components/ScheduledRecharge';
import WhatsAppSection from '@/components/WhatsAppSection';
import AppControleSection from '@/components/AppControleSection';
import BalanceCheck from '@/components/BalanceCheck';
import FooterLinks from '@/components/FooterLinks';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main>
        <Hero />
        <RechargeSection />
        <PaymentMethods />
        <ScheduledRecharge />
        <WhatsAppSection />
        <AppControleSection />
        <BalanceCheck />
        <FooterLinks />
      </main>
      
      <footer className="bg-gray-50 py-12 mt-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500 text-[10px]">
            <div className="space-y-2">
              <p>Viva Tudo: 5G, Ultra Banda Larga, HDTV, Voz e mais.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:underline">Acessibilidade</a>
                <a href="#" className="hover:underline">Privacidade</a>
                <a href="#" className="hover:underline">Fale conosco</a>
                <a href="#" className="hover:underline">Encontre uma Loja</a>
              </div>
            </div>
            
            <div className="text-right space-y-2">
              <p>Telefônica Brasil S.A CNPJ: 02.558.157/0001-62. Copyright 2025 © Vivo. Todos os direitos reservados.</p>
              <div className="flex justify-end">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Telefonica_Logo.svg/2560px-Telefonica_Logo.svg.png" alt="Telefónica" className="h-6 opacity-50" />
              </div>
            </div>
          </div>
          <div className="mt-8">
            <MadeWithDyad />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import RechargeSection from '@/components/RechargeSection';
import PaymentMethods from '@/components/PaymentMethods';
import ScheduledRecharge from '@/components/ScheduledRecharge';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main>
        <Hero />
        <PaymentMethods />
        <RechargeSection />
        <ScheduledRecharge />
      </main>
      
      <footer className="bg-gray-50 py-12 mt-12 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center text-gray-400 text-xs">
          <p>© 2024 Vivo. Todos os direitos reservados.</p>
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default Index;
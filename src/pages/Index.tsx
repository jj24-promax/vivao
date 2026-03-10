"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import RechargeSection from '@/components/RechargeSection';
import ScheduledRecharge from '@/components/ScheduledRecharge';
import WhatsAppSection from '@/components/WhatsAppSection';
import AppControleSection from '@/components/AppControleSection';
import BalanceCheck from '@/components/BalanceCheck';
import FooterLinks from '@/components/FooterLinks';
import Footer from '@/components/Footer';
import StickyMobileCTA from '@/components/StickyMobileCTA';

// Versão atualizada: 1.0.1 - Forçando atualização de produção
const Index = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main>
        <Hero />
        <RechargeSection />
        <BalanceCheck />
        <ScheduledRecharge />
        <WhatsAppSection />
        <AppControleSection />
        <FooterLinks />
      </main>
      <Footer />
      
      {/* Componentes de utilidade fixa */}
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
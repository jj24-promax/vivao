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
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import StickyMobileCTA from '@/components/StickyMobileCTA';

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
      <Footer />
      
      {/* Componentes de utilidade fixa */}
      <FloatingWhatsApp />
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
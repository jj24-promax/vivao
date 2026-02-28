"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";

const StickyMobileCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostra a barra após rolar 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToRecharge = () => {
    const element = document.getElementById('recharge-offers');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 md:hidden animate-in slide-in-from-bottom duration-300">
      <Button 
        onClick={scrollToRecharge}
        className="w-full h-14 bg-[#660099] hover:bg-[#550080] text-white font-bold text-lg rounded-xl shadow-lg flex items-center justify-center gap-3"
      >
        <Smartphone size={20} />
        Recarregar Agora
      </Button>
    </div>
  );
};

export default StickyMobileCTA;
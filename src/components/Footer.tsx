"use client";

import React from 'react';
import { ChevronUp } from 'lucide-react';
import { MadeWithDyad } from "./made-with-dyad";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#F6F6F6] py-12 mt-12 relative">
      <div className="container mx-auto px-4">
        {/* Back to top button */}
        <button 
          onClick={scrollToTop}
          className="absolute -top-6 right-8 md:right-12 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow text-gray-400"
        >
          <ChevronUp size={24} />
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8 text-[#666666] text-sm">
          {/* Left Side */}
          <div className="space-y-6">
            <p className="font-normal">Viva Tudo: 5G, Ultra Banda Larga, HDTV, Voz e mais.</p>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <a href="#" className="hover:text-[#660099] transition-colors">Acessibilidade</a>
              <a href="#" className="hover:text-[#660099] transition-colors">Privacidade</a>
              <a href="#" className="hover:text-[#660099] transition-colors">Fale conosco</a>
              <a href="#" className="hover:text-[#660099] transition-colors">Encontre uma Loja</a>
            </div>
          </div>
          
          {/* Right Side */}
          <div className="md:text-right space-y-1 max-w-md">
            <p>Telefônica Brasil S.A CNPJ: 02.558.157/0001- 62. Copyright 2025 © Vivo.</p>
            <p>Todos os direitos reservados.</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <MadeWithDyad />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
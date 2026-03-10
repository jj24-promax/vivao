"use client";

import React from 'react';
import { ChevronUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-12">
      {/* Main Footer Area */}
      <div className="bg-[#F6F6F6] py-10 relative">
        <div className="container mx-auto px-4">
          {/* Back to top button - Circular and thin arrow as in image */}
          <button 
            onClick={scrollToTop}
            className="absolute -top-5 right-8 md:right-12 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow text-gray-400"
          >
            <ChevronUp size={20} strokeWidth={1.5} />
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start gap-8 text-[#333333] text-[13px]">
            {/* Left Side */}
            <div className="space-y-6">
              <p className="font-normal">Viva Tudo: 5G, Ultra Banda Larga, HDTV, Voz e mais.</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <a href="#" className="hover:underline transition-colors">Acessibilidade</a>
                <a href="#" className="hover:underline transition-colors">Privacidade</a>
                <a href="#" className="hover:underline transition-colors">Fale conosco</a>
                <a href="#" className="hover:underline transition-colors">Encontre uma Loja</a>
              </div>
            </div>
            
            {/* Right Side - Removed copyright and CNPJ info */}
            <div className="md:text-left space-y-1">
              {/* Conteúdo removido a pedido do usuário */}
            </div>
          </div>
        </div>
      </div>

      {/* Telefónica Logo Area */}
      <div className="py-12 flex justify-center items-center">
        <div className="flex items-center gap-2">
          {/* Recreating the Telefónica logo with SVG for precision */}
          <svg width="140" height="32" viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="10" r="2.5" fill="#0066FF"/>
            <circle cx="13" cy="10" r="2.5" fill="#0066FF"/>
            <circle cx="20" cy="10" r="2.5" fill="#0066FF"/>
            <circle cx="9.5" cy="16" r="2.5" fill="#0066FF"/>
            <circle cx="16.5" cy="16" r="2.5" fill="#0066FF"/>
            <circle cx="13" cy="22" r="2.5" fill="#0066FF"/>
            <text x="32" y="21" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#0066FF">Telefónica</text>
          </svg>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
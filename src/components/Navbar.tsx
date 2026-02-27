"use client";

import React from 'react';

const Navbar = () => {
  const menuItems = [
    { label: 'Recarregue aqui', active: true },
    { label: 'Onde recarregar', active: false },
    { label: 'Recarga programada', active: false },
    { label: 'Consulta de Saldo', active: false },
    { label: 'Valores e validade', active: false },
    { label: 'Dúvidas', active: false },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between sm:justify-start py-4 sm:py-5">
          <img src="/vivo-logo.png" alt="Vivo" className="h-8 sm:h-10 mr-4 sm:mr-8" />
          <span className="text-[#660099] text-sm sm:text-base font-bold border-l border-gray-200 pl-4">Recarga Digital</span>
        </div>
        
        {/* Navigation - Scroll horizontal no mobile */}
        <nav className="flex space-x-6 sm:space-x-8 pb-1 overflow-x-auto no-scrollbar scroll-smooth">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`text-[13px] sm:text-[15px] whitespace-nowrap pb-3 border-b-2 transition-colors font-bold ${
                item.active 
                  ? 'text-[#660099] border-[#660099]' 
                  : 'text-gray-800 border-transparent hover:text-[#660099]'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
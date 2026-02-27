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
    <header className="w-full bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center py-5">
          <img src="/vivo-logo.png" alt="Vivo" className="h-10 mr-8" />
          <span className="text-[#660099] text-base font-medium">Recarga Digital</span>
        </div>
        
        {/* Navigation */}
        <nav className="flex space-x-8 pb-2 overflow-x-auto no-scrollbar">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`text-[15px] whitespace-nowrap pb-3 border-b-2 transition-colors ${
                item.active 
                  ? 'text-[#660099] border-[#660099] font-semibold' 
                  : 'text-gray-600 border-transparent hover:text-[#660099]'
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
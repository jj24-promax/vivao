"use client";

import React from 'react';
import { HelpCircle } from 'lucide-react';

const FooterLinks = () => {
  const links = [
    {
      icon: <img src="/vivo-chip-icon.png" alt="Chip" className="w-8 h-8" />,
      title: "VIVO CHIP",
      desc: "Compre seu Chip na loja online e venha pra Vivo.",
      action: "Compre agora"
    },
    {
      icon: <HelpCircle className="text-[#660099]" size={32} />,
      title: "DÚVIDAS",
      desc: "Acesse nosso FAQ e tire todas as suas dúvidas.",
      action: "Confira"
    },
    {
      icon: <img src="/vivo-regulamentos-icon.png" alt="Regulamentos" className="w-8 h-8" />,
      title: "REGULAMENTOS",
      desc: "Acesse todos os itens referentes à recarga Vivo.",
      action: "Confira"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-12 border-t border-gray-100">
      <h3 className="text-2xl font-light text-gray-800 mb-8">Veja também</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {links.map((link, index) => (
          <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-center min-w-[56px] min-h-[56px]">
              {link.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 mb-1">{link.title}</p>
              <p className="text-xs text-gray-500 mb-2">{link.desc}</p>
              <p className="text-xs font-bold text-[#660099] underline">{link.action}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FooterLinks;
"use client";

import React from 'react';
import { HelpCircle } from 'lucide-react';

const FooterLinks = () => {
  const links = [
    {
      icon: <img src="/vivo-chip-icon.png" alt="Chip" className="w-10 h-10" />,
      title: "VIVO CHIP",
      desc: "Compre seu Chip na loja online e venha pra Vivo.",
      action: "Compre agora",
      href: "https://store.vivo.com.br/vivo-chip-pre-15gb/p/YGSC244U5000?_ga=2.177269868.870077296.1692739961-1227726510.1676040283"
    },
    {
      icon: <HelpCircle className="text-[#660099]" size={40} />,
      title: "DÚVIDAS",
      desc: "Acesse nosso FAQ e tire todas as suas dúvidas.",
      action: "Confira",
      href: "#"
    },
    {
      icon: <img src="/vivo-regulamentos-icon.png" alt="Regulamentos" className="w-10 h-10" />,
      title: "REGULAMENTOS",
      desc: "Acesse todos os itens referentes à recarga Vivo.",
      action: "Confira",
      href: "#"
    }
  ];

  return (
    <section id="footer-links" className="container mx-auto px-4 py-16 border-t border-gray-100 scroll-mt-24">
      <h3 className="text-3xl font-light text-gray-800 mb-10">Veja também</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {links.map((link, index) => (
          <a 
            key={index} 
            href={link.href}
            target={link.href.startsWith('http') ? "_blank" : "_self"}
            rel={link.href.startsWith('http') ? "noopener noreferrer" : ""}
            className="flex gap-5 items-start p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
          >
            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-center min-w-[72px] min-h-[72px]">
              {link.icon}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-gray-900 tracking-wide">{link.title}</p>
              <p className="text-sm text-gray-600 leading-snug">{link.desc}</p>
              <p className="text-sm font-bold text-[#660099] underline pt-1 group-hover:text-[#550080]">
                {link.action}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default FooterLinks;
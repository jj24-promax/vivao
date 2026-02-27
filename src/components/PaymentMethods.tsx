"use client";

import React from 'react';

const PaymentMethods = () => {
  const logos = [
    { src: '/pix.png', alt: 'Pix' },
    { src: '/visa.png', alt: 'Visa' },
    { src: '/mastercard.png', alt: 'Mastercard' },
    { src: '/elo.png', alt: 'Elo' },
    { src: '/diners.png', alt: 'Diners Club' },
    { src: '/hiper.png', alt: 'Hipercard' },
    { src: '/amex.png', alt: 'American Express' },
    { src: '/caixa.png', alt: 'Caixa' },
  ];

  return (
    <section className="container mx-auto px-4 py-8 border-b border-gray-100">
      <p className="text-gray-600 text-sm mb-6">Você pode pagar com:</p>
      <div className="flex flex-wrap items-center gap-4 md:gap-8">
        {logos.map((logo, index) => (
          <div key={index} className="h-10 w-16 md:w-20 flex items-center justify-center border border-gray-100 rounded p-1 bg-white shadow-sm">
            <img 
              src={logo.src} 
              alt={logo.alt} 
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PaymentMethods;
'use client';

import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppFloatButton({ number }) {
  const href = `https://wa.me/${number}?text=${encodeURIComponent(
    'Olá! Vim pelo site e quero saber mais sobre a consultoria.'
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-110 transition-transform"
    >
      <FaWhatsapp size={26} />
    </a>
  );
}

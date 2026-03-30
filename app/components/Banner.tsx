import React from 'react';

// === CONFIGURACIÓN DEL BANNER ===
// Puedes cambiar estos valores fácilmente aquí para actualizar el banner en todo el juego.
export const BANNER_CONFIG = {
  // URL de la imagen de fondo (puedes usar una ruta local o una URL de internet)
  imageUrl: '/img/bannerbackground.png',
  // Texto descriptivo del banner
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  // URL a la que llevará el botón
  redirectUrl: 'https://ejemplo.com',
  // Texto del botón
  buttonText: 'CONOCE MÁS'
};
// =================================

interface BannerProps {
  imageUrl?: string;
  text?: string;
  redirectUrl?: string;
  buttonText?: string;
}

export const Banner: React.FC<BannerProps> = ({
  imageUrl = BANNER_CONFIG.imageUrl,
  text = BANNER_CONFIG.text,
  redirectUrl = BANNER_CONFIG.redirectUrl,
  buttonText = BANNER_CONFIG.buttonText
}) => {
  return (
    <div
      className="w-full mx-auto rounded-3xl overflow-hidden shadow-xl relative min-h-[140px] sm:min-h-[10px] flex flex-col sm:flex-row items-center justify-between gap-6 p-6 md:p-8 bg-cover bg-center border-4 border-white"
      style={{ backgroundImage: `url('${imageUrl}')`, backgroundColor: '#1e293b' }}
    >
      {/* Overlay oscuro para asegurar que el texto y botón destaquen sobre cualquier imagen de fondo */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

      {/* TEXTO DEL BANNER */}
      <div className="relative z-10 text-white max-w-2xl text-center sm:text-left">
        <p className="text-sm md:text-base font-medium leading-relaxed drop-shadow-md">
          {text}
        </p>
      </div>

      {/* BOTÓN CTA */}
      <a
        href={redirectUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 flex-shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white font-black tracking-wide py-3 px-8 rounded-full shadow-[0_4px_20px_rgba(16,185,129,0.4)] transform transition hover:scale-105 active:scale-95 border-2 border-emerald-400 text-center w-full sm:w-auto"
      >
        {buttonText}
      </a>
    </div>
  );
};

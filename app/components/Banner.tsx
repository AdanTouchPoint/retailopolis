import React from 'react';

// === CONFIGURACIÓN DEL BANNER ===
// Puedes cambiar estos valores fácilmente aquí para actualizar el banner en todo el juego.
export const BANNER_CONFIG = {
  // URL de la imagen de fondo (puedes usar una ruta local o una URL de internet)
  imageUrl: '/img/bannerbackground.png',
  // Título principal con fragmentos JSX si necesitas colorear partes
  title: (
    <>
      Implementa la solución <span className="text-[#35b87c]">líder en</span>
      <br />
      <span className="text-[#35b87c]">Retail Analytics</span> y vende más
    </>
  ),
  // URL a la que llevará el botón
  redirectUrl: 'https://footfall.getin.mx/mas-informacion',
  // Texto del botón
  buttonText: 'Agendar demo'
};
// =================================

interface BannerProps {
  imageUrl?: string;
  title?: React.ReactNode;
  redirectUrl?: string;
  buttonText?: string;
}

export const Banner: React.FC<BannerProps> = ({
  imageUrl = BANNER_CONFIG.imageUrl,
  title = BANNER_CONFIG.title,
  redirectUrl = BANNER_CONFIG.redirectUrl,
  buttonText = BANNER_CONFIG.buttonText
}) => {
  return (
    <div
      className="w-full mx-auto rounded-2xl overflow-hidden shadow-xl relative min-h-[120px] sm:min-h-[150px] flex flex-col justify-center py-4 px-6 sm:py-6 sm:px-10 bg-cover bg-right bg-no-repeat"
      style={{ backgroundImage: `url('${imageUrl}')`, backgroundColor: '#323639' }}
    >
      {/* Overlay opcional por si el fondo no es suficientemente oscuro en móviles, difuminado a la derecha */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#323639] via-[#323639]/80 to-transparent pointer-events-none sm:hidden"></div>

      {/* CONTENIDO DEL BANNER */}
      <div className="relative z-10 flex flex-col items-start text-left max-w-[65%] sm:max-w-xl">

        {/* TEXTO */}
        <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white leading-tight sm:leading-snug mb-3 sm:mb-4">
          {title}
        </h3>

        {/* BOTÓN CTA */}
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#35b87c] hover:bg-[#2d9d69] text-white font-semibold py-2.5 px-6 sm:py-3 sm:px-8 rounded-xl shadow-md transform transition hover:-translate-y-0.5"
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
};

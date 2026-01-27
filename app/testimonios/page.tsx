"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const testimonios = [
  {
    nombre: "Ana María G.",
    categoria: "Paciente de terapia de columna",
    texto: "Llegué con dolor lumbar crónico y ansiedad. Después de tres sesiones, pude volver a dormir bien. Su enfoque terapéutico va más allá del cuerpo, también sana la mente.",
    estrellas: 5,
    icono: "💎"
  },
  {
    nombre: "Carlos L.",
    categoria: "Masaje bienestar general",
    texto: "El ambiente, los aromas y la música hacen que uno se desconecte del estrés. Me sentí completamente renovado.",
    estrellas: 5,
    icono: "💆‍♂️"
  },
  {
    nombre: "Paola R.",
    categoria: "Deportista amateur",
    texto: "Me ayudaron a recuperar mi rodilla después de una lesión. No es un spa común, es un espacio de sanación real.",
    estrellas: 5,
    icono: "🌿"
  },
  {
    nombre: "Sandra T.",
    categoria: "Terapeuta ocupacional",
    texto: "Como profesional de la salud, sé reconocer una buena terapia. Aquí hay manos expertas y una calidez humana que no se encuentra fácil.",
    estrellas: 5,
    icono: "🌼"
  },
  {
    nombre: "Jorge M.",
    categoria: "Paciente posoperatorio",
    texto: "Después de mi cirugía de hombro, no podía mover el brazo. Hoy, gracias a la terapia personalizada, recuperé mi movilidad completa.",
    estrellas: 5,
    icono: "💫"
  },
  {
    nombre: "Lucía P.",
    categoria: "Masaje relajante premium",
    texto: "Cada detalle está cuidado. Desde el aroma hasta la temperatura de la habitación. Se nota el amor por lo que hacen.",
    estrellas: 5,
    icono: "💖"
  },
  {
    nombre: "Mariana S.",
    categoria: "Clienta frecuente",
    texto: "Voy cada dos semanas. Es mi momento de desconexión total. El trato siempre es impecable, y el lugar es hermoso.",
    estrellas: 5,
    icono: "🌺"
  },
  {
    nombre: "Andrés R.",
    categoria: "Fisioterapia deportiva",
    texto: "Soy corredor y venía con dolor constante en las piernas. El equipo me ayudó a mantenerme activo y sin lesiones.",
    estrellas: 5,
    icono: "💧"
  },
  {
    nombre: "Laura V.",
    categoria: "Masaje facial y ocular",
    texto: "Mi piel cambió totalmente. Se nota que usan productos profesionales y que saben lo que hacen.",
    estrellas: 5,
    icono: "🌻"
  },
  {
    nombre: "Diana C.",
    categoria: "Terapia de relajación profunda",
    texto: "Me sentí en paz. Literalmente salí flotando. Un espacio lleno de energía positiva.",
    estrellas: 5,
    icono: "🕊️"
  },
  {
    nombre: "Felipe H.",
    categoria: "Cliente corporativo",
    texto: "Llevé a mi equipo para una jornada de bienestar. Fue una experiencia transformadora. Todos salimos recargados.",
    estrellas: 5,
    icono: "🌷"
  },
  {
    nombre: "Valeria Q.",
    categoria: "Masaje de espalda y cuello",
    texto: "Trabajo muchas horas frente al computador. Aquí encontré el alivio perfecto. No hay comparación.",
    estrellas: 5,
    icono: "🌹"
  },
  {
    nombre: "Natalia R.",
    categoria: "Terapia facial y corporal completa",
    texto: "La atención de la fisioterapeuta Carolina fue maravillosa. Tiene manos mágicas. Es profesional, dulce y muy dedicada.",
    estrellas: 5,
    icono: "🪶"
  },
  {
    nombre: "David S.",
    categoria: "Paciente de lesiones musculares",
    texto: "Había probado otros lugares sin éxito. Aquí, desde la primera sesión, noté el cambio. Un servicio de primera.",
    estrellas: 5,
    icono: "🌿"
  },
  {
    nombre: "Carolina P.",
    categoria: "Cliente habitual",
    texto: "No solo te relajan el cuerpo, también te calman el alma. Es mi lugar favorito para desconectar del mundo.",
    estrellas: 5,
    icono: "💮"
  }
];

export default function TestimoniosPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const itemsPerPage = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };

  const getItemsPerPage = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return itemsPerPage.mobile;
      if (window.innerWidth < 1024) return itemsPerPage.tablet;
      return itemsPerPage.desktop;
    }
    return itemsPerPage.desktop;
  };

  const [visibleItems, setVisibleItems] = useState(getItemsPerPage());

  useEffect(() => {
    const handleResize = () => {
      setVisibleItems(getItemsPerPage());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, visibleItems]);

  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev + visibleItems >= testimonios.length ? 0 : prev + visibleItems
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(testimonios.length - visibleItems, 0) : Math.max(prev - visibleItems, 0)
    );
  };

  const visibleTestimonios = testimonios.slice(currentIndex, currentIndex + visibleItems);

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-100">
      {/* Elementos decorativos flotantes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 text-4xl animate-float">🌸</div>
        <div className="absolute top-40 right-20 text-3xl animate-float-delay-1">💧</div>
        <div className="absolute bottom-32 left-1/4 text-3xl animate-float-delay-2">🍃</div>
        <div className="absolute top-1/3 right-1/3 text-2xl animate-float">✨</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-float-delay-1">🌺</div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-amber-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Testimonios
          </h1>
          <p className="text-lg md:text-xl text-stone-600 mb-2">
            💬 Historias que inspiran bienestar
          </p>
          <p className="text-sm md:text-base text-stone-500 max-w-3xl mx-auto">
            Cada historia refleja más que una sesión: refleja transformación, alivio y conexión interior. 
            En Therapy Aqua Spa, cada cliente es parte de nuestra familia de bienestar.
          </p>
        </div>

        {/* Carrusel de testimonios */}
        <div className="relative"
             onMouseEnter={() => setIsAutoPlaying(false)}
             onMouseLeave={() => setIsAutoPlaying(true)}>
          
          {/* Botón anterior */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-300 hover:scale-110"
            aria-label="Anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-amber-800">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Grid de testimonios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-2 md:px-8">
            {visibleTestimonios.map((testimonio, index) => (
              <div
                key={currentIndex + index}
                className="bg-white rounded-3xl shadow-xl p-6 md:p-8 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in"
              >
                {/* Icono y estrellas */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl md:text-5xl">{testimonio.icono}</span>
                  <div className="flex gap-1">
                    {[...Array(testimonio.estrellas)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5 text-amber-400">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>

                {/* Texto del testimonio */}
                <p className="text-stone-700 text-sm md:text-base leading-relaxed mb-6 italic">
                  "{testimonio.texto}"
                </p>

                {/* Información del cliente */}
                <div className="border-t border-stone-200 pt-4">
                  <p className="font-semibold text-amber-900 text-base md:text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {testimonio.nombre}
                  </p>
                  <p className="text-stone-500 text-xs md:text-sm">
                    {testimonio.categoria}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Botón siguiente */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-300 hover:scale-110"
            aria-label="Siguiente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-amber-800">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Indicadores de página */}
        <div className="flex justify-center gap-2 mt-8 md:mt-12">
          {Array.from({ length: Math.ceil(testimonios.length / visibleItems) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * visibleItems)}
              className={`h-2 md:h-3 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / visibleItems) === index
                  ? 'w-8 md:w-12 bg-amber-600'
                  : 'w-2 md:w-3 bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </div>

        {/* Llamado a la acción */}
        <div className="text-center mt-12 md:mt-16">
          <p className="text-stone-600 mb-4 text-sm md:text-base">
            ¿Listo para tu propia experiencia de transformación?
          </p>
          <button className="bg-[#3d2817] hover:bg-[#2d1f11] text-white px-8 md:px-12 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Conocer las terapias
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delay-1 {
          animation: float 6s ease-in-out 2s infinite;
        }

        .animate-float-delay-2 {
          animation: float 6s ease-in-out 4s infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </main>
  );
}
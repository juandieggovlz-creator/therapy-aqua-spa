"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Hooks CMS eliminados

// Helper para codificar URLs de imágenes
function getImagePath(filename: string): string {
  return `/image/${encodeURIComponent(filename)}`;
}

type ServicioDestacado = {
  id: number;
  key: string;
  title: string;
  icon: string;
  price: number;
  priceLabel: string;
  duration: string;
  imagen: string;
  description: string;
  detalles: string[];
  precioOriginal?: number;
  descuento?: number;
};

const serviciosDestacadosBase: ServicioDestacado[] = [
  {
    id: 1,
    key: "columna",
    title: "THERAPY LESIONES DE COLUMNA",
    icon: "🦴",
    price: 100000,
    priceLabel: "desde $100.000",
    duration: "30 min",
    imagen: getImagePath("therapy lesiones de columna 2.jpg"),
    description: "Tratamiento especializado para dolor lumbar, cervical y dorsalgia. Recupera tu movilidad y alivia el dolor crónico.",
    detalles: [
      "Evaluación postural completa",
      "Terapia manual especializada",
      "Ejercicios de fortalecimiento",
      "Técnicas de alivio del dolor",
      "Plan de seguimiento personalizado"
    ]
  },
  {
    id: 2,
    key: "bienestar-general",
    title: "MASAJE BIENESTAR GENERAL",
    icon: "🌿",
    price: 140000,
    priceLabel: "$140.000",
    duration: "45 min",
    imagen: getImagePath("masaje general.jfif"),
    description: "Masaje corporal completo que combina técnicas de relajación profunda para reducir estrés y tensión muscular.",
    detalles: [
      "Masaje corporal completo",
      "Aromaterapia relajante",
      "Música terapéutica",
      "Técnicas de relajación profunda",
      "Mejora de circulación sanguínea"
    ]
  },
  {
    id: 3,
    key: "deportivo",
    title: "MASAJE THERAPY DEPORTIVO",
    icon: "🏃",
    price: 100000,
    priceLabel: "$100.000",
    duration: "40 min",
    imagen: getImagePath("masaje deportivo.jpg"),
    description: "Ideal para atletas y personas activas. Previene lesiones y mejora el rendimiento físico.",
    detalles: [
      "Preparación pre-competencia",
      "Recuperación post-entrenamiento",
      "Liberación de tensión muscular",
      "Mejora de flexibilidad",
      "Prevención de lesiones deportivas"
    ]
  },
  {
    id: 4,
    key: "preso-ocular",
    title: "PRESO THERAPY OCULAR",
    icon: "👁️",
    price: 80000,
    priceLabel: "$80.000",
    duration: "30 min",
    imagen: getImagePath("therapy ocular.jpg"),
    description: "Tratamiento innovador para ojos cansados, ojeras y tensión ocular. Refresca y revitaliza tu mirada.",
    detalles: [
      "Masaje de contorno de ojos",
      "Reducción de ojeras",
      "Desinflamación de párpados",
      "Alivio de tensión ocular",
      "Efecto lifting natural"
    ]
  },
  {
    id: 5,
    key: "skincare-mano",
    title: "SKINCARE MANO THERAPY",
    icon: "🤲",
    price: 90000,
    priceLabel: "$90.000",
    duration: "30 min",
    imagen: getImagePath("skincare mano.jpg"),
    description: "Rejuvenecimiento de manos con exfoliación, hidratación profunda y masaje especializado.",
    detalles: [
      "Exfoliación suave",
      "Masaje de manos y antebrazos",
      "Hidratación profunda",
      "Tratamiento anti-edad",
      "Nutrición de uñas y cutículas"
    ]
  },
  {
    id: 6,
    key: "facial",
    title: "MASAJE FACIAL",
    icon: "✨",
    price: 90000,
    priceLabel: "$90.000",
    duration: "30 min",
    imagen: getImagePath("masaje facial.jpg"),
    description: "Masaje facial con técnicas lifting que mejoran la circulación y tonifican los músculos faciales.",
    detalles: [
      "Limpieza facial profunda",
      "Masaje linfático facial",
      "Técnicas de lifting natural",
      "Hidratación intensiva",
      "Rejuvenecimiento de la piel"
    ]
  }
];

const testimoniosQuick = [
  { name: "Ana María G.", text: "Llegué con dolor lumbar crónico. Después de tres sesiones, pude volver a dormir bien.", stars: 5 },
  { name: "Carlos L.", text: "El ambiente y los aromas hacen que uno se desconecte del estrés completamente.", stars: 5 },
  { name: "Paola R.", text: "Me ayudaron a recuperar mi rodilla. No es un spa común, es sanación real.", stars: 5 },
];

export default function HomePage() {
  const [serviciosDestacados, setServiciosDestacados] = useState<ServicioDestacado[]>(serviciosDestacadosBase);
  const [promocionActiva, setPromocionActiva] = useState<any>(null);
  const [currentTestimonio, setCurrentTestimonio] = useState(0);
  const [loading, setLoading] = useState(true);

  // Cargar servicios desde la API
  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const response = await fetch('/api/servicios-publicos');
        const data = await response.json();
        
        if (data.success && data.servicios && data.servicios.length > 0) {
          // Tomar solo los primeros 6 servicios para la página principal
          const serviciosParaMostrar = data.servicios.slice(0, 6);
          console.log('✅ Servicios cargados desde API:', serviciosParaMostrar.length);
          setServiciosDestacados(serviciosParaMostrar);
        } else {
          console.log('ℹ️ Usando servicios por defecto');
        }
        setLoading(false);
      } catch (error) {
        console.error('❌ Error cargando servicios:', error);
        console.log('ℹ️ Usando servicios por defecto');
        setLoading(false);
      }
    };

    cargarServicios();
  }, []);

  // Animación de testimonios
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonio((prev) => (prev + 1) % testimoniosQuick.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-100 overflow-hidden">
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src="/image/28a4ed9b-c783-4bca-9170-ac1fbf5cf12f.jpg" 
            alt="Therapy Aqua Spa"
            fill
            className="object-cover opacity-20"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-stone-50/80 to-neutral-100/80"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center px-4 transition-all duration-1000 transform opacity-100 translate-y-0">
          <div className="mb-6 inline-block">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg animate-pulse">
              ✨ Bienvenido a tu santuario de bienestar
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#3d2817] mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Therapy Aqua Spa
          </h1>
          
          <p className="text-xl md:text-3xl text-amber-700 mb-8 font-semibold">
            Terapia que alivia tu cuerpo
          </p>
          
          <p className="text-base md:text-lg text-stone-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Fisioterapia profesional y masajes terapéuticos en el corazón de Bogotá. 
            Transformamos tu dolor en bienestar, tu tensión en paz.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/servicios"
              className="group relative inline-flex items-center gap-3 bg-[#3d2817] hover:bg-[#2d1f11] text-white px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-110 shadow-2xl overflow-hidden"
            >
              <span className="relative z-10">Ver Terapias</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            
            <Link 
              href="/reservas"
              className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-110 shadow-2xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Reservar Ahora
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#3d2817]" style={{ fontFamily: "'Playfair Display', serif" }}>500+</div>
              <div className="text-sm text-stone-600 mt-1">Clientes Felices</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#3d2817]" style={{ fontFamily: "'Playfair Display', serif" }}>14</div>
              <div className="text-sm text-stone-600 mt-1">Terapias Especializadas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#3d2817]" style={{ fontFamily: "'Playfair Display', serif" }}>5★</div>
              <div className="text-sm text-stone-600 mt-1">Calificación Promedio</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-stone-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </div>
      </section>

      {/* Banner de Promoción Activa */}
      {promocionActiva && (
        <section className="py-8 px-4 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-y-2 border-green-200">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
              {/* Decoración de fondo */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                    <span className="text-white font-bold text-sm uppercase tracking-wider">🎁 Promoción Especial</span>
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {promocionActiva.textoPromocional || promocionActiva.titulo}
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
                    <span className="text-3xl md:text-4xl font-bold text-white">
                      {promocionActiva.tipo === 'porcentaje' 
                        ? `${promocionActiva.valor}% OFF`
                        : `$${promocionActiva.valor.toLocaleString('es-CO')} OFF`}
                    </span>
                    {promocionActiva.tipoAplicacion === 'monto_minimo' && promocionActiva.montoMinimo && (
                      <span className="text-white/90 text-sm md:text-base">
                        En reservas con total superior a ${promocionActiva.montoMinimo.toLocaleString('es-CO')}
                      </span>
                    )}
                    {promocionActiva.tipoAplicacion === 'servicios_especificos' && promocionActiva.serviciosIds && (
                      <span className="text-white/90 text-sm md:text-base">
                        En servicios seleccionados
                      </span>
                    )}
                    {promocionActiva.tipoAplicacion === 'todos' && (
                      <span className="text-white/90 text-sm md:text-base">
                        Aplica a todos nuestros servicios
                      </span>
                    )}
                  </div>
                  {promocionActiva.descripcion && (
                    <p className="text-white/90 mt-3 text-sm md:text-base">
                      {promocionActiva.descripcion}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <Link
                    href="/reservas"
                    className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                  >
                    <span>Reservar Ahora</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              💎 Terapias Más Solicitadas
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Descubre nuestros tratamientos estrella diseñados para tu bienestar integral
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {serviciosDestacadosBase.map((servicio) => (
              <div 
                key={servicio.id}
                className="relative h-[480px] cursor-pointer"
                style={{ perspective: '1000px' }}
              >
                <div 
                  className="relative w-full h-full transition-all duration-700"
                  style={{
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div 
                    className="absolute w-full h-full bg-gradient-to-br from-amber-50 to-stone-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image 
                        src={servicio.imagen}
                        alt={servicio.title}
                        width={500}
                        height={300}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                      <div className="absolute top-4 left-4 text-4xl filter drop-shadow-lg">{servicio.icon}</div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                        <p className="text-xs font-bold text-[#3d2817]">{servicio.duration}</p>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="text-xl font-bold text-[#3d2817] mb-3 leading-tight min-h-[60px]" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {servicio.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-stone-600 mb-4">
                          {servicio.descuento && servicio.descuento > 0 ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-stone-400 line-through">
                                ${servicio.precioOriginal?.toLocaleString()}
                              </span>
                              <span className="font-bold text-green-600 text-lg">
                                ${Math.round(servicio.price).toLocaleString()}
                              </span>
                              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded">
                                -{servicio.descuento}%
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-amber-700 text-lg">{servicio.priceLabel}</span>
                          )}
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed line-clamp-3">
                          {servicio.description}
                        </p>
                      </div>
                      <div className="text-center mt-4">
                        <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-[#3d2817]">
                          Hover para ver más
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="absolute w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <div className="h-full flex flex-col p-6">
                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-bold text-[#3d2817]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Detalles del Tratamiento
                          </h4>
                          <span className="text-3xl">{servicio.icon}</span>
                        </div>
                        
                        <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                          {servicio.description}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          <p className="text-sm font-semibold text-[#3d2817] mb-3">Incluye:</p>
                          {servicio.detalles.map((detalle, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              <span>{detalle}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 pt-4 border-t border-stone-200 flex-shrink-0">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-stone-600">Duración: <strong>{servicio.duration}</strong></span>
                          {servicio.descuento && servicio.descuento > 0 ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-stone-400 line-through">
                                ${servicio.precioOriginal?.toLocaleString()}
                              </span>
                              <span className="font-bold text-green-600">
                                ${Math.round(servicio.price).toLocaleString()}
                              </span>
                              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded">
                                -{servicio.descuento}%
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-amber-700">{servicio.priceLabel}</span>
                          )}
                        </div>
                        <Link 
                          href="/servicios"
                          className="w-full bg-stone-200 hover:bg-stone-300 text-[#3d2817] px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 text-center"
                        >
                          Ver Más Terapias
                        </Link>
                        <Link 
                          href={`/reservas?servicio=${servicio.key}`}
                          className="w-full bg-[#3d2817] hover:bg-[#2d1f11] text-white px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 text-center"
                        >
                          Reservar Ahora
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-amber-50 to-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mb-6 shadow-xl overflow-hidden">
                  <img 
                    src="/image/fisioterapeuta.jpg" 
                    alt="Dra. Carolina Trujillo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Dra. Carolina Trujillo
                  </h3>
                  <p className="text-amber-700 font-semibold mb-4">Fisioterapeuta Profesional</p>
                  <div className="flex justify-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-400">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl -z-10"></div>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-[#3d2817] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Experta en tu Bienestar
              </h2>
              <p className="text-stone-600 leading-relaxed mb-6">
                Con años de experiencia y pasión por la sanación, la Dra. Carolina Trujillo lidera nuestro equipo con profesionalismo y calidez humana.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#3d2817]">Certificación Profesional</h4>
                    <p className="text-sm text-stone-600">Formación avanzada en fisioterapia</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-amber-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#3d2817]">Enfoque Humanizado</h4>
                    <p className="text-sm text-stone-600">Atención personalizada</p>
                  </div>
                </div>
              </div>
              <Link 
                href="/reservas"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Agendar con la Dra. Carolina
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            💬 Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-lg text-stone-600 mb-12">
            Historias reales de transformación y bienestar
          </p>

          <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
              </svg>
            </div>

            <div className="transition-all duration-500 transform">
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(testimoniosQuick[currentTestimonio].stars)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-amber-400">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <p className="text-lg md:text-xl text-stone-700 italic mb-6 leading-relaxed">
                &quot;{testimoniosQuick[currentTestimonio].text}&quot;
              </p>
              <p className="font-semibold text-[#3d2817]" style={{ fontFamily: "'Playfair Display', serif" }}>
                — {testimoniosQuick[currentTestimonio].name}
              </p>
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {testimoniosQuick.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonio(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentTestimonio === idx ? 'w-8 bg-amber-600' : 'bg-stone-300 hover:bg-stone-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-amber-100 to-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              ⭐ ¿Por Qué Elegirnos?
            </h2>
            <p className="text-lg text-stone-600">
              Lo que nos hace diferentes y especiales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-3xl shadow-lg p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-stone-100 to-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#3d2817]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#3d2817] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Atención Premium
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Espacios confortables, equipos de última generación y protocolos certificados para tu tranquilidad.
              </p>
            </div>

            <div className="group bg-white rounded-3xl shadow-lg p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-amber-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#3d2817] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Experiencia Profesional
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Equipo liderado por la Dra. Carolina Trujillo, con formación avanzada y años de experiencia.
              </p>
            </div>

            <div className="group bg-white rounded-3xl shadow-lg p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#3d2817] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Ubicación Segura
              </h3>
              <p className="text-stone-600 leading-relaxed">
                En el Círculo de Suboficiales FF.MM., con parqueadero disponible y fácil acceso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de anuncios deshabilitada */}

    </main>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PromocionesPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [promocionActiva, setPromocionActiva] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPromocion = async () => {
      try {
        const response = await fetch('/api/admin/promociones');
        const data = await response.json();
        setPromocionActiva(data.promocion);
      } catch (error) {
        console.error('Error cargando promoción:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPromocion();
  }, []);

  useEffect(() => {
    setIsVisible(true);
    const calculateTimeLeft = () => {
      if (promocionActiva && promocionActiva.activa) {
        const fechaLimite = new Date(promocionActiva.fechaLimite);
        const ahora = new Date();
        const diferencia = fechaLimite.getTime() - ahora.getTime();

        if (diferencia > 0) {
          setTimeLeft({
            days: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diferencia / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diferencia / 1000 / 60) % 60),
            seconds: Math.floor((diferencia / 1000) % 60)
          });
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [promocionActiva]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-100 overflow-hidden">
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.5); }
          50% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.8); }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Elementos decorativos flotantes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 text-5xl animate-float">💆</div>
        <div className="absolute top-40 right-20 text-4xl animate-float" style={{ animationDelay: '1s' }}>🎁</div>
        <div className="absolute bottom-32 left-1/4 text-4xl animate-float" style={{ animationDelay: '2s' }}>✨</div>
        <div className="absolute top-1/3 right-1/3 text-3xl animate-float" style={{ animationDelay: '3s' }}>🌿</div>
        <div className="absolute bottom-20 right-10 text-5xl animate-float" style={{ animationDelay: '4s' }}>💎</div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              🎉 OFERTAS LIMITADAS
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Promociones Especiales
          </h1>
          <p className="text-xl md:text-2xl text-stone-600 max-w-3xl mx-auto">
            Aprovecha nuestras ofertas exclusivas y descubre el bienestar que mereces
          </p>
        </div>

        {/* Mensaje cuando no hay promociones */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3d2817] mx-auto"></div>
            <p className="mt-4 text-stone-600">Cargando promociones...</p>
          </div>
        ) : (!promocionActiva || !promocionActiva.activa) ? (
          <div className="mb-20">
            <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16 text-center">
              <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-6xl">📭</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                No hay promociones de momento
              </h2>
              <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto">
                Estamos preparando nuevas ofertas especiales para ti. ¡Vuelve pronto para descubrir nuestras próximas promociones!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/servicios" className="inline-flex items-center gap-2 bg-[#3d2817] hover:bg-[#2d1f11] text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
                  Ver Servicios
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <a href="https://wa.link/mlbr4z" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Contáctanos
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Promoción Activa */
          <div className="mb-20">
          <div className="relative bg-gradient-to-br from-[#3d2817] via-amber-900 to-[#2d1f11] rounded-3xl shadow-2xl overflow-hidden animate-pulse-glow">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full opacity-20 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full opacity-20 blur-3xl" />
            </div>

            <div className="relative bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 py-3 text-center overflow-hidden">
              <div className="absolute inset-0 animate-shimmer" />
              <p className="relative text-[#3d2817] font-bold text-lg">
                🔥 OFERTA EXCLUSIVA - SOLO HASTA EL {promocionActiva?.fechaLimite ? new Date(promocionActiva.fechaLimite).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }).toUpperCase() : '31 DE DICIEMBRE'} 🔥
              </p>
            </div>

            <div className="relative z-10 p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border-2 border-amber-400/50">
                      <span className="text-3xl">⚡</span>
                      <span className="text-white font-bold text-lg">SUPER DESCUENTO</span>
                    </div>
                    
                    <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-amber-300 mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {promocionActiva?.descuento || 40}% OFF
                    </h2>
                    
                    <p className="text-3xl md:text-4xl text-white font-bold mb-4">
                      {promocionActiva?.titulo || 'Masajes Personalizados'}
                    </p>
                    
                    <p className="text-xl text-amber-200 mb-8">
                      {promocionActiva?.descripcion || '¡Tu momento de relajación al mejor precio del año!'}
                    </p>
                  </div>

                  {/* Countdown Timer */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border-2 border-amber-400/30">
                    <p className="text-amber-300 font-semibold mb-4 text-center text-lg">⏰ Termina en:</p>
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: 'Días', value: timeLeft.days },
                        { label: 'Horas', value: timeLeft.hours },
                        { label: 'Min', value: timeLeft.minutes },
                        { label: 'Seg', value: timeLeft.seconds }
                      ].map((item, idx) => (
                        <div key={idx} className="text-center">
                          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-2 border border-amber-400/30">
                            <div className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                              {String(item.value).padStart(2, '0')}
                            </div>
                          </div>
                          <div className="text-xs text-amber-200 font-semibold">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Beneficios */}
                  <div className="space-y-3 mb-8">
                    {[
                      "Aplicable en todos los masajes personalizados",
                      "Adaptado 100% a tus necesidades",
                      "Profesionales certificados",
                      "Ambiente relajante"
                    ].map((beneficio, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-white bg-white/5 backdrop-blur-sm rounded-xl p-3 hover:bg-white/10 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span className="text-lg">{beneficio}</span>
                      </div>
                    ))}
                  </div>

                  {/* Botones */}
                  <div className="flex justify-center">
                    <Link href="/reservas" className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-[#3d2817] px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-110 shadow-2xl overflow-hidden">
                      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 relative z-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      <span className="relative z-10">¡Reservar Ahora!</span>
                    </Link>
                  </div>
                </div>

                {/* Card de precio */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl blur-xl opacity-50" />
                  <div className="relative bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-amber-400/50 shadow-2xl">
                    <div className="text-center">
                      <div className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-[#3d2817] px-6 py-2 rounded-full font-bold text-sm mb-6 shadow-lg">
                        💎 OFERTA PREMIUM
                      </div>

                      <div className="mb-6">
                        <p className="text-white/70 text-lg mb-2">Precio Regular</p>
                        <p className="text-4xl font-bold text-white/50 line-through mb-2">$140.000</p>
                      </div>

                      <div className="relative h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-6 rounded-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-amber-400/30">
                        <p className="text-amber-300 text-xl mb-3 font-semibold">Precio con 40% OFF</p>
                        <div className="relative inline-block">
                          <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-50" />
                          <p className="relative text-7xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                            $84.000
                          </p>
                        </div>
                        <div className="inline-block bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold mt-4 shadow-lg">
                          ¡Ahorras $56.000!
                        </div>
                      </div>

                      <div className="space-y-3 text-left bg-white/5 backdrop-blur-sm rounded-xl p-4">
                        {[
                          { icon: "⏱️", text: "Duración: 45 minutos" },
                          { icon: "🎯", text: "100% Personalizado" },
                          { icon: "✨", text: "Incluye aromaterapia" },
                          { icon: "📅", text: "Válido hasta 31/12/2025" }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-white">
                            <span className="text-2xl">{item.icon}</span>
                            <span className="font-semibold">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Términos y Condiciones */}
        <div className="bg-gradient-to-br from-stone-100 to-stone-50 rounded-3xl p-8 md:p-12 shadow-xl border border-stone-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-[#3d2817] rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                📋 Términos y Condiciones
              </h3>
              <p className="text-stone-600">Lee atentamente las condiciones de la promoción</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              {
                icon: "🚫",
                titulo: "No Acumulables",
                texto: "Las promociones no son acumulables con otras ofertas activas."
              },
              {
                icon: "📅",
                titulo: "Vigencia",
                texto: "Válido hasta el 31 de diciembre de 2025."
              },
              {
                icon: "⏰",
                titulo: "Reserva Previa",
                texto: "Se requiere reserva previa. Sujeto a disponibilidad."
              },
              {
                icon: "📞",
                titulo: "Más Información",
                texto: "Contáctanos por WhatsApp para más detalles."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-stone-200">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h4 className="font-bold text-[#3d2817] mb-1">{item.titulo}</h4>
                    <p className="text-sm text-stone-600">{item.texto}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href="https://wa.link/mlbr4z" target="_blank" rel="noopener noreferrer" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Contactar por WhatsApp
            </a>
            <Link href="/legal/terminos" className="bg-stone-200 hover:bg-stone-300 text-[#3d2817] px-6 py-3 rounded-full font-semibold transition-all duration-300 text-center">
              Ver términos completos
            </Link>
          </div>
        </div>

        {/* CTA Final */}
        <div className="mt-16">
          <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10 text-center py-16 px-8">
              <div className="inline-block mb-6">
                <span className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-bold border-2 border-white/30">
                  🌟 NO PIERDAS ESTA OPORTUNIDAD
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                ¿Listo para Sentirte Mejor?
              </h2>
              
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Aprovecha esta oferta exclusiva y comienza tu transformación hoy mismo
              </p>

              <div className="flex justify-center items-center">
                <Link href="/servicios" className="inline-flex items-center gap-2 bg-white hover:bg-stone-100 text-green-600 px-12 py-5 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-110 shadow-2xl">
                  Ver Servicios
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
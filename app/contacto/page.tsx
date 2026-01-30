"use client";

import React from 'react';

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-100">
      {/* Elementos decorativos flotantes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 text-4xl animate-float">📍</div>
        <div className="absolute top-40 right-20 text-3xl animate-float-delay-1">💬</div>
        <div className="absolute bottom-32 left-1/4 text-3xl animate-float-delay-2">📞</div>
        <div className="absolute top-1/3 right-1/3 text-2xl animate-float">✨</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-float-delay-1">🗺️</div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Contáctanos
          </h1>
          <p className="text-lg md:text-xl text-stone-600 mb-2">
            📍 Estamos aquí para atenderte
          </p>
          <p className="text-sm md:text-base text-stone-500 max-w-3xl mx-auto">
            Visítanos, escríbenos o llámanos. Estamos listos para ayudarte a comenzar tu camino hacia el bienestar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Mapa */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
            <div className="relative h-[400px] w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.862596289032!2d-74.1048!3d4.7108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDInMzguOSJOIDc0wrAwNicyOC44Ilc!5e0!3m2!1ses!2sco!4v1234567890123!5m2!1ses!2sco"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Therapy Aqua Spa"
              />
            </div>
            <div className="p-6 md:p-8 bg-gradient-to-br from-amber-50 to-stone-50">
              <h3 className="text-xl md:text-2xl font-semibold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                📍 Therapy Aqua Spa
              </h3>
              <p className="text-sm md:text-base text-stone-600 mb-4">
                Calle 138 Nro. 55-38<br />
                Círculo de Suboficiales de las Fuerzas Militares<br />
                Bogotá D.C., Colombia
              </p>
              <div className="flex items-center gap-2 text-xs md:text-sm text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Parqueadero disponible • Acceso seguro</span>
              </div>
              <a
                href="https://maps.app.goo.gl/gDk47ksiJij6ACfE6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#3d2817] hover:bg-[#2d1f11] text-white px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Abrir en Google Maps
              </a>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="space-y-6">
            {/* WhatsApp Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-xl p-6 md:p-8 border-2 border-green-200 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-7 h-7">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    WhatsApp Directo
                  </h3>
                  <p className="text-sm md:text-base text-stone-600">
                    Chatea con la Dra. Carolina Trujillo
                  </p>
                </div>
              </div>
              <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                Recibe atención personalizada, resuelve tus dudas y agenda tu cita de forma rápida y directa.
              </p>
              <a
                href="https://wa.me/573014185239"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full justify-center"
              >
                💬 Escribir ahora
              </a>
            </div>

            {/* Horarios Card */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-amber-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Horarios de Atención
                  </h3>
                  <p className="text-sm text-stone-500">Te esperamos en nuestras instalaciones</p>
                </div>
              </div>
              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                  <span className="font-semibold text-stone-700">Lunes - Miércoles</span>
                  <span className="text-red-600 font-bold">Cerrado</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                  <span className="font-semibold text-stone-700">Jueves - Domingo</span>
                  <span className="text-green-600 font-bold">08:00 AM - 03:30 PM</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                  💡 <strong>Recomendación:</strong> Llega 20 minutos antes de tu cita para completar el registro y disfrutar de la experiencia completa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Parqueadero Seguro
            </h3>
            <p className="text-sm text-stone-600">
              Contamos con parqueadero dentro del complejo para tu comodidad y seguridad.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ambiente Seguro
            </h3>
            <p className="text-sm text-stone-600">
              Ubicados en las instalaciones del Círculo de Suboficiales FF.MM.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-pink-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Atención Cálida
            </h3>
            <p className="text-sm text-stone-600">
              Personal profesional y dedicado a tu bienestar integral.
            </p>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center bg-gradient-to-br from-amber-100 to-stone-100 rounded-3xl p-8 md:p-12 shadow-xl">
          <h2 className="text-2xl md:text-3xl text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¿Tienes alguna pregunta?
          </h2>
          <p className="text-stone-600 mb-8 text-sm md:text-base max-w-2xl mx-auto">
            Estamos disponibles para resolver todas tus dudas. Contáctanos por WhatsApp y recibe atención inmediata.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://wa.me/573014185239"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Chatear ahora
            </a>
            <a
              href="/faqs"
              className="inline-block bg-[#3d2817] hover:bg-[#2d1f11] text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Ver preguntas frecuentes
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
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
      `}</style>
    </main>
  );
}
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const instalaciones = [
  {
    id: 1,
    titulo: "Sala de Terapias",
    imagen: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop",
    descripcion: "Espacios amplios y cómodos para tus sesiones"
  },
  {
    id: 2,
    titulo: "Zona de Relajación",
    imagen: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&h=600&fit=crop",
    descripcion: "Ambiente tranquilo y acogedor"
  },
  {
    id: 3,
    titulo: "Equipos Profesionales",
    imagen: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop",
    descripcion: "Tecnología de última generación"
  },
  {
    id: 4,
    titulo: "Salas de Masajes",
    imagen: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop",
    descripcion: "Privacidad y confort garantizados"
  },
  {
    id: 5,
    titulo: "Recepción",
    imagen: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=800&h=600&fit=crop",
    descripcion: "Atención cálida desde tu llegada"
  }
];

function GaleriaInstalaciones() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % instalaciones.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + instalaciones.length) % instalaciones.length);
  };

  return (
    <div className="bg-gradient-to-br from-stone-900 to-[#3d2817] rounded-3xl shadow-2xl overflow-hidden mb-16 p-8 md:p-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          📸 Conoce Nuestras Instalaciones
        </h2>
        <p className="text-stone-300 max-w-2xl mx-auto">
          Un espacio diseñado para tu comodidad y bienestar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Carrusel de Fotos */}
        <div className="lg:col-span-2 relative">
          <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            {instalaciones.map((foto, index) => (
              <div
                key={foto.id}
                className={`absolute inset-0 transition-all duration-700 transform ${
                  index === currentSlide 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-95'
                }`}
              >
                <img
                  src={foto.imagen}
                  alt={foto.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {foto.titulo}
                  </h3>
                  <p className="text-white/90">{foto.descripcion}</p>
                </div>
              </div>
            ))}

            {/* Controles del carrusel */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {instalaciones.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 h-2 bg-white'
                      : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                  } rounded-full`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* QR de Instagram */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8 text-pink-600">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              ¡Síguenos en Instagram!
            </h3>
            <p className="text-white/90 text-sm mb-6">
              Descubre más fotos y videos de nuestras instalaciones, tratamientos y el día a día del spa
            </p>
          </div>

          {/* QR Code Real */}
          <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
            <div className="aspect-square flex items-center justify-center">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.instagram.com/therapyaquaspa?utm_source=qr%26igsh=MTNzaTduczUzbW56"
                alt="QR Code Instagram Therapy Aqua Spa"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <a
            href="https://www.instagram.com/therapyaquaspa?utm_source=qr&igsh=MTNzaTduczUzbW56"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-white hover:bg-stone-100 text-pink-600 font-bold py-4 rounded-full text-center transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Visitar @therapyaquaspa
            </span>
          </a>

          <p className="text-white/70 text-xs text-center mt-4">
            ✨ Contenido exclusivo • Promociones • Testimonios
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SobreNosotrosPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-100">
      {/* Elementos decorativos flotantes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 text-4xl animate-float">🌿</div>
        <div className="absolute top-40 right-20 text-3xl animate-float-delay-1">💆</div>
        <div className="absolute bottom-32 left-1/4 text-3xl animate-float-delay-2">✨</div>
        <div className="absolute top-1/3 right-1/3 text-2xl animate-float">🧘</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-float-delay-1">💫</div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-amber-100 to-stone-100 text-[#3d2817] px-6 py-2 rounded-full text-sm font-semibold border-2 border-amber-200">
              ✨ Conoce nuestra historia
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#3d2817] mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Bienvenido a Therapy Aqua Spa
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl text-amber-700">Tu refugio de bienestar integral</span>
          </h1>
          <p className="mx-auto mt-6 max-w-4xl text-base md:text-lg leading-relaxed text-stone-600">
            En Therapy Aqua Spa transformamos la fisioterapia y los tratamientos de bienestar en una experiencia de renovación profunda para cuerpo y mente. Ubicados en el <strong>Círculo de Suboficiales de las Fuerzas Militares</strong> (Calle 138 Nro. 55-38, Bogotá D.C.), ofrecemos un entorno exclusivo donde técnicas terapéuticas avanzadas se combinan con un ambiente de calma y cuidado personalizado.
          </p>
        </div>

        {/* Grid de Cards Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Quiénes somos */}
          <div className="group relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full -translate-y-16 translate-x-16 opacity-50 blur-2xl transition-all duration-500 group-hover:scale-150" />
            <div className="relative p-8">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#3d2817] mb-4 transition-colors duration-300 group-hover:text-green-700" style={{ fontFamily: "'Playfair Display', serif" }}>
                👥 Quiénes somos
              </h2>
              <p className="text-stone-600 leading-relaxed">
                Somos un equipo profesional liderado por la fisioterapeuta <strong>Dra. Carolina Trujillo</strong>, comprometida con tu salud muscular, movilidad y equilibrio corporal. Nuestro enfoque se basa en protocolos clínicos para el alivio de lesiones, mejora de la postura y mejor desempeño físico, sumado a terapias de relajación profunda que fomentan tu bienestar integral.
              </p>
            </div>
          </div>

          {/* Qué hacemos */}
          <div className="group relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full -translate-y-16 translate-x-16 opacity-50 blur-2xl transition-all duration-500 group-hover:scale-150" />
            <div className="relative p-8">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-amber-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 005.4-5.4 2.25 2.25 0 012.4-2.245 3 3 0 005.78 1.128m-15.482.017a4.5 4.5 0 011.41-.513m11.851 0a4.5 4.5 0 01.494-.902l1.562-1.562a4.5 4.5 0 00-6.364-6.364l-1.562 1.562a4.5 4.5 0 01-.902.494m-16.5.41a4.5 4.5 0 00-1.41.513m14.095 0a4.5 4.5 0 011.41-.513m-16.5.41a4.5 4.5 0 011.085.802m14.095 0a4.5 4.5 0 00.802 1.085m-11.851 0a4.5 4.5 0 01-.513-1.41m11.851 0a4.5 4.5 0 00.902-.494l1.562-1.562a4.5 4.5 0 006.364 6.364l1.562-1.562a4.5 4.5 0 01.494-.902m-14.095 0a4.5 4.5 0 00-.802-1.085m14.095 0a4.5 4.5 0 011.085.802" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#3d2817] mb-4 transition-colors duration-300 group-hover:text-amber-700" style={{ fontFamily: "'Playfair Display', serif" }}>
                💆 Qué hacemos
              </h2>
              <p className="text-stone-600 leading-relaxed">
                Nuestros procedimientos combinan <strong>fisioterapia avanzada</strong>, masajes terapéuticos y tratamientos especializados como crioterapia, termoterapia, maderoterapia y presoterapia ocular. El resultado: mayor elasticidad muscular, mejor circulación y una experiencia de bienestar que revitaliza.
              </p>
            </div>
          </div>

          {/* Nuestro compromiso */}
          <div className="group relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 md:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full -translate-y-16 translate-x-16 opacity-50 blur-2xl transition-all duration-500 group-hover:scale-150" />
            <div className="relative p-8">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.75 3.75 0 01-4.061-1.174A3.75 3.75 0 0115 9.75c0-1.268.63-2.39 1.593-3.068a3.75 3.75 0 014.061 1.174A3.75 3.75 0 0121 12zm-9 0c0 1.268-.63 2.39-1.593 3.068a3.75 3.75 0 01-4.061-1.174A3.75 3.75 0 015.25 9.75c0-1.268.63-2.39 1.593-3.068a3.75 3.75 0 014.061 1.174A3.75 3.75 0 0112 12z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#3d2817] mb-4 transition-colors duration-300 group-hover:text-blue-700" style={{ fontFamily: "'Playfair Display', serif" }}>
                ✅ Nuestro compromiso
              </h2>
              <ul className="space-y-3 text-stone-600">
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Atención personalizada desde tu primer contacto.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Ambiente premium, higiénico y con equipo de última generación.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Resultados reales que mejoran tu salud, movimiento y calidad de vida.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Transparencia en precios y procedimientos, porque tu tranquilidad importa.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sección de Valores */}
        <div className="bg-gradient-to-br from-amber-100 to-stone-100 rounded-3xl p-8 md:p-12 shadow-xl mb-16">
          <h2 className="text-3xl md:text-4xl text-center text-[#3d2817] mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
            💎 Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="text-lg font-semibold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Compromiso
              </h3>
              <p className="text-sm text-stone-600">
                Dedicados a tu bienestar y recuperación
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Excelencia
              </h3>
              <p className="text-sm text-stone-600">
                Calidad en cada tratamiento
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="text-4xl mb-3">💚</div>
              <h3 className="text-lg font-semibold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Empatía
              </h3>
              <p className="text-sm text-stone-600">
                Entendemos tus necesidades
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="text-4xl mb-3">🌟</div>
              <h3 className="text-lg font-semibold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Innovación
              </h3>
              <p className="text-sm text-stone-600">
                Tecnología de vanguardia
              </p>
            </div>
          </div>
        </div>

        {/* Sección Dra. Carolina */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-6xl">👩‍⚕️</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Dra. Carolina Trujillo
                </h3>
                <p className="text-amber-700 font-medium">Fisioterapeuta Profesional</p>
              </div>
            </div>
            <div className="p-8 md:p-12 flex items-center">
              <div>
                <h3 className="text-2xl md:text-3xl text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Experiencia y Dedicación
                </h3>
                <p className="text-stone-600 leading-relaxed mb-4">
                  Con años de experiencia en fisioterapia y tratamientos especializados, la Dra. Carolina Trujillo lidera nuestro equipo con pasión y profesionalismo.
                </p>
                <p className="text-stone-600 leading-relaxed">
                  Su enfoque integral combina técnicas modernas con un trato cálido y personalizado, asegurando que cada paciente reciba la atención que merece.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Carrusel de Instalaciones */}
        <GaleriaInstalaciones />

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-br from-[#3d2817] to-[#2d1f11] rounded-3xl p-8 md:p-12 shadow-2xl text-white">
          <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¿Listo para transformar tu bienestar?
          </h2>
          <p className="mx-auto max-w-2xl text-base md:text-lg leading-relaxed mb-8 text-stone-200">
            Te invitamos a conocer nuestras terapias, reservar tu cita y dar el primer paso hacia una nueva versión de ti.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/servicios"
              className="inline-block bg-white hover:bg-stone-100 text-[#3d2817] px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Ver servicios
            </Link>
            <Link
              href="https://wa.link/mlbr4z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Reservar cita
            </Link>
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
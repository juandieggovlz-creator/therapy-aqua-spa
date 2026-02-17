"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type SobreNosotros = {
  titulo?: string;
  subtitulo?: string;
  descripcion?: string;
  valores?: string[];
};

type Ubicacion = {
  direccion?: string;
  lugar?: string;
  ciudad?: string;
  googleMapsLink?: string;
  codigoEmbed?: string;
  mapaEmbed?: string;
  mapaLink?: string;
  parqueadero?: boolean;
  infoAcceso?: string;
  acceso?: string;
};

const instalaciones = [
  {
    id: 1,
    titulo: "Sala de Terapias",
    imagen: "/image/2c84dc0f-1af8-4160-9e2f-e504429fca2a.jpg",
    descripcion: "Espacios amplios y cómodos para tus sesiones"
  },
  {
    id: 2,
    titulo: "Zona de Relajación",
    imagen: "/image/1a8c1e64-22dc-423d-9c8f-48d88075d332.jpg",
    descripcion: "Ambiente tranquilo y acogedor"
  },
  {
    id: 3,
    titulo: "Equipos Profesionales",
    imagen: "/image/5d5872a2-22b0-4868-b570-b8d5b99819ef.jpg",
    descripcion: "Tecnología de última generación"
  },
  {
    id: 4,
    titulo: "Salas de Masajes",
    imagen: "/image/28a4ed9b-c783-4bca-9170-ac1fbf5cf12f.jpg",
    descripcion: "Privacidad y confort garantizados"
  },
  {
    id: 5,
    titulo: "Recepción",
    imagen: "/image/30bdda70-b307-4f03-aae7-d8fd5eb1f389.jpg",
    descripcion: "Atención cálida desde tu llegada"
  },
  {
    id: 6,
    titulo: "Área de Tratamientos",
    imagen: "/image/420e216b-ef7c-4e0d-b20d-8dac3642fc56.jpg",
    descripcion: "Espacios diseñados para tu bienestar"
  },
  {
    id: 7,
    titulo: "Instalaciones Premium",
    imagen: "/image/55bf92ed-bec7-40b3-91d3-5278ec868e3c.jpg",
    descripcion: "Ambiente de lujo y comodidad"
  },
  {
    id: 8,
    titulo: "Zona de Descanso",
    imagen: "/image/595725e3-0acc-47b5-899d-462272a2e598.jpg",
    descripcion: "Relájate después de tu tratamiento"
  },
  {
    id: 9,
    titulo: "Espacios Modernos",
    imagen: "/image/622cb65a-87c3-46f8-bbf9-26b78a4a22e3.jpg",
    descripcion: "Diseño contemporáneo y funcional"
  },
  {
    id: 10,
    titulo: "Ambiente Acogedor",
    imagen: "/image/663d9950-161d-45ac-bc64-e8882ed90b9f.jpg",
    descripcion: "Cada detalle pensado para ti"
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
        <div className="flex items-center justify-center gap-4 mb-4">
          <img
            src="/image/logo-oficial.jpg"
            alt="Therapy Aqua Spa Logo"
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover shadow-lg"
          />
          <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            📸 Conoce Nuestras Instalaciones
          </h2>
        </div>
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
                className={`absolute inset-0 transition-all duration-700 transform ${index === currentSlide
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
                  className={`transition-all duration-300 ${index === currentSlide
                    ? 'w-8 h-2 bg-white'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                    } rounded-full`}
                />
              ))}
            </div>
          </div>

          {/* Galería de miniaturas */}
          <div className="mt-6 grid grid-cols-5 gap-2">
            {instalaciones.map((foto, index) => (
              <button
                key={foto.id}
                onClick={() => setCurrentSlide(index)}
                className={`relative h-20 md:h-24 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-110 ${index === currentSlide ? 'ring-4 ring-amber-400 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
              >
                <img
                  src={foto.imagen}
                  alt={foto.titulo}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 ${index === currentSlide ? 'bg-amber-400/20' : 'bg-black/30'
                  } transition-all duration-300`} />
              </button>
            ))}
          </div>
        </div>

        {/* QR de Instagram */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8 text-pink-600">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
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
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
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
  const [cmsContent, setCmsContent] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/web-content?section=about');
        const data = await res.json();
        if (data.success) setCmsContent(data.content);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchContent();
  }, []);

  const getCms = (key: string, fallback: string) => cmsContent[key]?.content || fallback;

  const sobreNosotros = {
    titulo: getCms('about_title', 'Sobre Nosotros'),
    subtitulo: getCms('about_subtitle', 'Tu refugio de bienestar integral'),
    descripcion: getCms('about_description', 'En Therapy Aqua Spa transformamos la fisioterapia y los tratamientos de bienestar en una experiencia de renovación profunda para cuerpo y mente.'),
    valores: ['Atención personalizada', 'Ambiente premium', 'Profesionalismo', 'Innovación']
  };

  const ubicacion = {
    direccion: 'Calle 138 Nro. 55-38',
    lugar: 'Círculo de Suboficiales de las Fuerzas Militares',
    ciudad: 'Bogotá D.C.',
    mapaLink: 'https://www.google.com/maps/place/C%C3%ADrculo+de+Suboficiales+de+las+Fuerzas+Militares+Sede+Social+Colina+Campestre/@4.7270293,-74.0630815,17z/data=!3m1!4b1!4m6!3m5!1s0x8e3f85166d81d1a9:0x2f6f5f8e86302677!8m2!3d4.727024!4d-74.0605066!16s%2Fg%2F1tj74n8d?entry=ttu&g_ep=EgoyMDI2MDIxMS4wIKXMDSoASAFQAw%3D%3D'
  };


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
            {sobreNosotros.titulo || 'Bienvenido a Therapy Aqua Spa'}
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl text-amber-700">{sobreNosotros.subtitulo || 'Tu refugio de bienestar integral'}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-4xl text-base md:text-lg leading-relaxed text-stone-600">
            {sobreNosotros.descripcion || 'En Therapy Aqua Spa transformamos la fisioterapia y los tratamientos de bienestar en una experiencia de renovación profunda para cuerpo y mente.'} Ubicados en el <strong>{ubicacion.lugar || 'Círculo de Suboficiales de las Fuerzas Militares'}</strong> ({ubicacion.direccion || 'Calle 138 Nro. 55-38'}, {ubicacion.ciudad || 'Bogotá D.C., Colombia'}), ofrecemos un entorno exclusivo donde técnicas terapéuticas avanzadas se combinan con un ambiente de calma y cuidado personalizado.
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
                {sobreNosotros.valores && sobreNosotros.valores.length > 0 ? (
                  sobreNosotros.valores.map((valor: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span>{valor}</span>
                    </li>
                  ))
                ) : (
                  <>
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
                  </>
                )}
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
                <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                  <img
                    src="/image/fisioterapeuta.jpg"
                    alt="Dra. Carolina Trujillo"
                    className="w-full h-full object-cover"
                  />
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
            Te invitamos a conocer nuestras terapias y dar el primer paso hacia una nueva versión de ti.
          </p>
          <div className="flex items-center justify-center">
            <Link
              href="/servicios"
              className="inline-block bg-white hover:bg-stone-100 text-[#3d2817] px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Ver servicios
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
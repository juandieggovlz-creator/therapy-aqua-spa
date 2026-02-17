"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Mapeo de iconos originales por pregunta (o parte de ella)
  const getIcon = (pregunta: string) => {
    if (pregunta.includes('tiempo')) return "🕐";
    if (pregunta.includes('ropa')) return "👕";
    if (pregunta.includes('tarde')) return "⏰";
    if (pregunta.includes('reagendar')) return "📅";
    if (pregunta.includes('acompañante')) return "👥";
    if (pregunta.includes('parqueadero')) return "🅿️";
    if (pregunta.includes('afiliados')) return "⭐";
    if (pregunta.includes('higiene')) return "🧼";
    if (pregunta.includes('personales')) return "🔐";
    if (pregunta.includes('celular')) return "📵";
    if (pregunta.includes('regalar')) return "🎁";
    if (pregunta.includes('horario')) return "🕗";
    if (pregunta.includes('ubicados')) return "📍";
    if (pregunta.includes('comunicarme')) return "📲";
    return "✨";
  };

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch('/api/faqs-publicos');
        const data = await res.json();
        if (data.success) {
          setFaqs(data.faqs);
        }
      } catch (e) {
        console.error('Error fetching FAQs:', e);
      }
      setLoading(false);
    };
    fetchFaqs();
  }, []);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-100">
      {/* Elementos decorativos flotantes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 text-4xl animate-float">💬</div>
        <div className="absolute top-40 right-20 text-3xl animate-float-delay-1">❓</div>
        <div className="absolute bottom-32 left-1/4 text-3xl animate-float-delay-2">💡</div>
        <div className="absolute top-1/3 right-1/3 text-2xl animate-float">✨</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-float-delay-1">📋</div>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-amber-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Preguntas Frecuentes
          </h1>
          <p className="text-lg md:text-xl text-stone-600 mb-2">
            💬 Dudas resueltas para tu mejor experiencia
          </p>
          <p className="text-sm md:text-base text-stone-500 max-w-3xl mx-auto">
            Encuentra respuestas rápidas sobre nuestros servicios, horarios y recomendaciones.
          </p>
        </div>

        {/* Acordeón de FAQs */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
            </div>
          ) : (
            faqs.length > 0 ? faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                {/* Botón de pregunta */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left transition-colors duration-300 hover:bg-stone-50"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-3xl md:text-4xl flex-shrink-0">{getIcon(faq.question)}</span>
                    <h3 className="text-base md:text-lg font-semibold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {faq.question}
                    </h3>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className={`w-5 h-5 md:w-6 md:h-6 text-amber-800 flex-shrink-0 transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''
                      }`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* Respuesta expandible */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${openId === faq.id ? 'max-h-96' : 'max-h-0'
                    }`}
                >
                  <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2">
                    <div className="pl-12 md:pl-16 pr-4">
                      <p className="text-stone-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-stone-500">No hay preguntas registradas aún.</div>
            )
          )}
        </div>

        {/* CTA final */}
        <div className="mt-16 text-center bg-white rounded-3xl p-8 md:p-12 shadow-xl">
          <h2 className="text-2xl md:text-3xl text-amber-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¿Aún tienes dudas?
          </h2>
          <p className="text-stone-600 mb-6 text-sm md:text-base">
            Estamos aquí para ayudarte. Contáctanos y te atenderemos con gusto.
          </p>
          <div className="flex justify-center items-center">
            <a
              href="https://wa.me/573014185239"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contáctanos por WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Botón de volver */}
      <div className="fixed bottom-8 left-8 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-800 border-2 border-stone-300 px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span className="font-medium">Volver al inicio</span>
        </Link>
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
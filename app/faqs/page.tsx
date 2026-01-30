"use client";

import React, { useState } from 'react';
import Link from 'next/link';

type DiaHorario = {
  abierto: boolean;
  apertura: string;
  cierre: string;
};

type Horarios = {
  lunes?: DiaHorario;
  martes?: DiaHorario;
  miercoles?: DiaHorario;
  jueves?: DiaHorario;
  viernes?: DiaHorario;
  sabado?: DiaHorario;
  domingo?: DiaHorario;
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

type Contacto = {
  telefono?: string;
  email?: string;
  whatsapp?: string;
  whatsappLink?: string;
  mensajeContacto?: string;
  horariosAtencion?: string;
};

const faqs = [
  {
    id: 1,
    pregunta: "¿Cuánto tiempo antes debo llegar a mi cita?",
    respuesta: "Recomendamos llegar 20 minutos antes de la hora agendada para realizar tu registro, cambiarte con calma y disfrutar la experiencia completa sin contratiempos.",
    icon: "🕐"
  },
  {
    id: 2,
    pregunta: "¿Qué ropa debo llevar?",
    respuesta: "👩 Damas: traje de baño de dos piezas.\n👨 Caballeros: pantaloneta de baño.\n\nSi lo prefieres, puedes adquirir en el spa un kit de ropa interior desechable y candado para casillero.",
    icon: "👕"
  },
  {
    id: 3,
    pregunta: "¿Qué pasa si llego tarde a mi cita?",
    respuesta: "Si llegas tarde, tu tiempo de servicio podría verse reducido para no afectar las siguientes reservas. Si el retraso es mayor, se reagendará según disponibilidad.",
    icon: "⏰"
  },
  {
    id: 4,
    pregunta: "¿Puedo reagendar o cancelar mi cita?",
    respuesta: "Sí. Puedes hacerlo con un mínimo de 24 horas de anticipación. Pasado ese tiempo, el valor de la sesión se mantiene sin posibilidad de devolución.",
    icon: "📅"
  },
  {
    id: 5,
    pregunta: "¿Puedo asistir con acompañante?",
    respuesta: "Algunos servicios pueden realizarse en pareja o grupo, pero requieren reserva anticipada. Confirma la disponibilidad antes de asistir.",
    icon: "👥"
  },
  {
    id: 6,
    pregunta: "¿El spa tiene parqueadero o acceso fácil?",
    respuesta: "Sí, estamos dentro del Círculo de Suboficiales FF.MM., un espacio seguro, con parqueadero y fácil acceso desde la Calle 138.",
    icon: "🅿️"
  },
  {
    id: 7,
    pregunta: "¿Tienen servicios exclusivos para afiliados?",
    respuesta: "Sí, contamos con descuentos y beneficios especiales para afiliados. Al iniciar sesión en el portal, podrás acceder a tus tarifas preferenciales.",
    icon: "⭐"
  },
  {
    id: 8,
    pregunta: "¿Qué medidas de higiene y seguridad manejan?",
    respuesta: "Cumplimos protocolos de bioseguridad certificados. Cada área es desinfectada antes y después de cada sesión. Además, todos nuestros implementos son esterilizados o desechables.",
    icon: "🧼"
  },
  {
    id: 9,
    pregunta: "¿Puedo llevar objetos personales?",
    respuesta: "Sí, disponemos de casilleros individuales para guardar tus pertenencias. Recomendamos no traer objetos de valor.",
    icon: "🔐"
  },
  {
    id: 10,
    pregunta: "¿Se permite el uso de celular o cámaras durante la sesión?",
    respuesta: "Por respeto a la privacidad de nuestros usuarios, no se permite grabar ni usar el celular dentro de las zonas húmedas o de terapia.",
    icon: "📵"
  },
  {
    id: 11,
    pregunta: "¿Puedo regalar una experiencia en el spa?",
    respuesta: "¡Claro! Tenemos bonos de regalo personalizados que puedes obsequiar para ocasiones especiales. Pregunta por ellos en recepción o en nuestro WhatsApp oficial.",
    icon: "🎁"
  },
  {
    id: 12,
    pregunta: "¿Cuál es el horario de atención?",
    respuesta: "🕗 Lunes: Cerrado\n🕗 Martes: Cerrado\n🕗 Miércoles: Cerrado\n🕗 Jueves a Domingo: 08:00 AM – 04:00 PM",
    icon: "🕗"
  },
  {
    id: 13,
    pregunta: "¿Dónde están ubicados?",
    respuesta: "📍 Círculo de Suboficiales FF.MM.\nCalle 138 Nro. 55-38, Bogotá D.C.",
    icon: "📍"
  },
  {
    id: 14,
    pregunta: "¿Cómo puedo comunicarme directamente?",
    respuesta: "📲 WhatsApp directo: wa.me/573014185239 o llámanos al +57 301 4185239\nSiempre hay alguien dispuesto a orientarte y ayudarte con tu reserva.",
    icon: "📲"
  }
];

export default function FaqsPage() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  // Generar horarios desde CMS
  const generarHorariosTexto = () => {
    const horariosCMS: Horarios = {
      lunes: { abierto: true, apertura: '08:00', cierre: '20:00' },
      martes: { abierto: true, apertura: '08:00', cierre: '20:00' },
      miercoles: { abierto: true, apertura: '08:00', cierre: '20:00' },
      jueves: { abierto: true, apertura: '08:00', cierre: '20:00' },
      viernes: { abierto: true, apertura: '08:00', cierre: '20:00' },
      sabado: { abierto: true, apertura: '08:00', cierre: '20:00' },
      domingo: { abierto: false, apertura: '08:00', cierre: '16:00' }
    };
    const diasMap = [
      { key: 'lunes', label: 'Lunes' },
      { key: 'martes', label: 'Martes' },
      { key: 'miercoles', label: 'Miércoles' },
      { key: 'jueves', label: 'Jueves' },
      { key: 'viernes', label: 'Viernes' },
      { key: 'sabado', label: 'Sábado' },
      { key: 'domingo', label: 'Domingo' }
    ];

    const formatearHora = (hora: string) => {
      if (!hora) return '';
      const [h, m] = hora.split(':');
      const horaNum = parseInt(h);
      const periodo = horaNum >= 12 ? 'PM' : 'AM';
      const hora12 = horaNum % 12 || 12;
      return `${hora12.toString().padStart(2, '0')}:${m} ${periodo}`;
    };

    return diasMap.map(({ key, label }) => {
      const diaData = horariosCMS[key as keyof typeof horariosCMS] || { abierto: false, apertura: '08:00', cierre: '16:00' };
      if (diaData.abierto) {
        const apertura = formatearHora(diaData.apertura || '08:00');
        const cierre = formatearHora(diaData.cierre || '16:00');
        return `🕗 ${label}: ${apertura} – ${cierre}`;
      } else {
        return `🕗 ${label}: Cerrado`;
      }
    }).join('\n');
  };

  // Actualizar FAQs dinámicamente
  const faqsActualizados = faqs.map(faq => {
    if (faq.id === 12) {
      // Horario de atención
      const horariosTexto = generarHorariosTexto();
      if (horariosTexto) {
        return {
          ...faq,
          respuesta: horariosTexto
        };
      }
    }
    if (faq.id === 13) {
      // Ubicación
      const ubicacion: Ubicacion = {
        direccion: 'Cra 27 #6-56',
        lugar: 'Centro de Pasto',
        ciudad: 'Pasto, Nariño',
        mapaLink: 'https://maps.google.com/?q=Cra+27+6-56+Pasto'
      };
      if (ubicacion.lugar || ubicacion.direccion) {
        return {
          ...faq,
          respuesta: `📍 ${ubicacion.lugar || 'Centro de Pasto'}\n${ubicacion.direccion || 'Cra 27 #6-56'}, ${ubicacion.ciudad || 'Pasto, Nariño'}`
        };
      }
    }
    if (faq.id === 14) {
      // Contacto
      const contacto: Contacto = {
        telefono: '+57 301 4185239',
        email: 'contacto@therapyspa.com',
        whatsappLink: 'https://wa.me/573014185239'
      };
      if (contacto.whatsappLink || contacto.telefono || contacto.email) {
        const whatsappLink = contacto.whatsappLink || 'https://wa.me/573014185239';
        const telefono = contacto.telefono || '';
        const email = contacto.email || '';
        let respuesta = `📲 WhatsApp directo: ${whatsappLink}`;
        if (telefono) respuesta += `\n📞 Teléfono: ${telefono}`;
        if (email) respuesta += `\n✉️ Email: ${email}`;
        respuesta += '\nSiempre hay alguien dispuesto a orientarte y ayudarte con tu reserva.';
        return {
          ...faq,
          respuesta
        };
      }
    }
    return faq;
  });

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
            💬 Preguntas Frecuentes y Recomendaciones Generales
          </p>
          <p className="text-sm md:text-base text-stone-500 max-w-3xl mx-auto">
            Encuentra respuestas rápidas a las dudas más comunes sobre nuestros servicios, horarios y políticas.
          </p>
        </div>

        {/* Acordeón de FAQs */}
        <div className="space-y-4">
          {faqsActualizados.map((faq) => (
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
                  <span className="text-3xl md:text-4xl flex-shrink-0">{faq.icon}</span>
                  <h3 className="text-base md:text-lg font-semibold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {faq.pregunta}
                  </h3>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className={`w-5 h-5 md:w-6 md:h-6 text-amber-800 flex-shrink-0 transition-transform duration-300 ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Respuesta expandible */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openId === faq.id ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2">
                  <div className="pl-12 md:pl-16 pr-4">
                    <p className="text-stone-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
                      {faq.respuesta}
                    </p>
                    
                    {/* Enlaces especiales */}
                    {faq.id === 13 && (
                      <a
                        href="https://maps.google.com/?q=Cra+27+6-56+Pasto"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 text-amber-700 hover:text-amber-900 font-medium underline"
                      >
                        Ver en Google Maps →
                      </a>
                    )}
                    
                    {faq.id === 14 && (
                      <a
                        href="https://wa.me/573014185239"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
                      >
                        Chatear por WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
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
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Escríbenos
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
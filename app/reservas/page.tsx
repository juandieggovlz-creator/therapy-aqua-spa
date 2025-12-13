"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type TerapiaItem = {
  id: string;
  nombre: string;
  duracion: number;
  precio: number;
  icon: string;
};

type ServicioAdicional = {
  id: string;
  nombre: string;
  precioAfiliado: number;
  precioParticular: number;
  icon: string;
};

type ProductoSpa = {
  id: string;
  nombre: string;
  precio: number;
  icon: string;
};

const terapias: TerapiaItem[] = [
  { id: 'columna', nombre: 'THERAPY LESIONES DE COLUMNA', duracion: 30, precio: 100000, icon: '🦴' },
  { id: 'brazos', nombre: 'THERAPY LESIONES MUSCULARES BRAZOS', duracion: 30, precio: 60000, icon: '💪' },
  { id: 'piernas', nombre: 'THERAPY LESIONES MUSCULARES PIERNAS', duracion: 30, precio: 60000, icon: '🦵' },
  { id: 'hombro', nombre: 'THERAPY TRAUMA HOMBRO, CODO, MUÑECA', duracion: 30, precio: 250000, icon: '🤝' },
  { id: 'cadera', nombre: 'THERAPY TRAUMA CADERA, RODILLA, TOBILLO', duracion: 30, precio: 250000, icon: '🦿' },
  { id: 'mano', nombre: 'SKINCARE MANO THERAPY', duracion: 30, precio: 90000, icon: '🤲' },
  { id: 'ocular', nombre: 'PRESO THERAPY OCULAR', duracion: 30, precio: 80000, icon: '👁️' },
  { id: 'bienestar', nombre: 'MASAJE BIENESTAR GENERAL', duracion: 45, precio: 140000, icon: '🌿' },
  { id: 'facial', nombre: 'MASAJE FACIAL', duracion: 30, precio: 90000, icon: '✨' },
  { id: 'espalda', nombre: 'MASAJE DE ESPALDA', duracion: 30, precio: 120000, icon: '🧘' },
  { id: 'hombros', nombre: 'MASAJE HOMBROS Y BRAZOS', duracion: 30, precio: 100000, icon: '💆' },
  { id: 'rodillas', nombre: 'MASAJE CADERAS Y RODILLAS', duracion: 30, precio: 120000, icon: '🦴' },
  { id: 'pies', nombre: 'MASAJE PANTORRILLAS Y PIES', duracion: 30, precio: 120000, icon: '🦶' },
  { id: 'deportivo', nombre: 'MASAJE THERAPY DEPORTIVO', duracion: 40, precio: 100000, icon: '🏃' },
];

// Paquete de servicios (sauna + jacuzzi + turco)
const paqueteServicios = {
  id: 'paquete-relajacion',
  nombre: 'Paquete Relajación (Sauna + Jacuzzi + Turco)',
  precioAfiliado: 40800, // 13600 * 3
  precioParticular: 89700, // 29900 * 3
  icon: '💆',
  servicios: ['sauna', 'jacuzzi', 'turco']
};

const serviciosAdicionales: ServicioAdicional[] = [
  { id: 'sauna', nombre: 'Sauna', precioAfiliado: 13600, precioParticular: 29900, icon: '🔥' },
  { id: 'jacuzzi', nombre: 'Jacuzzi', precioAfiliado: 13600, precioParticular: 29900, icon: '🛁' },
  { id: 'turco', nombre: 'Baño Turco', precioAfiliado: 13600, precioParticular: 29900, icon: '💨' },
];

const productosSpa: ProductoSpa[] = [
  { id: 'candado', nombre: 'Candado para casillero', precio: 5000, icon: '🔐' },
  { id: 'ropa', nombre: 'Kit ropa interior desechable', precio: 8000, icon: '👕' },
];

const horariosDisponibles = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'
];

export default function ReservasPage() {
  const searchParams = useSearchParams();
  const [paso, setPaso] = useState(1);
  const [esAfiliado, setEsAfiliado] = useState(false);
  const [afiliadoNombre, setAfiliadoNombre] = useState<string | null>(null);
  const [terapiasSeleccionadas, setTerapiasSeleccionadas] = useState<string[]>([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<string[]>([]);
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(false);
  const [productosSeleccionados, setProductosSeleccionados] = useState<string[]>([]);
  const [fecha, setFecha] = useState('');
  const [horario, setHorario] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [notas, setNotas] = useState('');
  const [metodoPago, setMetodoPago] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [reservaExitosa, setReservaExitosa] = useState(false);

  const diasCerrados = [1, 2, 3]; // Lunes, Martes, Miércoles

  // Detectar afiliado al cargar
  useEffect(() => {
    const afiliadoToken = sessionStorage.getItem('afiliado_token');
    const afiliadoData = sessionStorage.getItem('afiliado');
    
    if (afiliadoToken && afiliadoData) {
      const afiliado = JSON.parse(afiliadoData);
      setEsAfiliado(true);
      setAfiliadoNombre(afiliado.nombre);
      setNombre(afiliado.nombre);
      setTelefono(afiliado.telefono);
      setEmail(afiliado.email);
    }
  }, []);

  // Detectar servicio precargado desde URL
  useEffect(() => {
    const servicioParam = searchParams?.get('servicio');
    if (servicioParam && terapiasSeleccionadas.length === 0) {
      const terapia = terapias.find(t => t.id === servicioParam);
      if (terapia) {
        setTerapiasSeleccionadas([terapia.id]);
        setPaso(2); // Ir directamente al paso de selección de terapias
      }
    }
  }, [searchParams]);

  const esDiaValido = (fecha: string) => {
    if (!fecha) return true;
    const dia = new Date(fecha + 'T00:00:00').getDay();
    return !diasCerrados.includes(dia);
  };

  const toggleTerapia = (id: string) => {
    setTerapiasSeleccionadas(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const toggleServicio = (id: string) => {
    setServiciosSeleccionados(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const togglePaquete = () => {
    if (paqueteSeleccionado) {
      // Deseleccionar paquete y todos sus servicios
      setPaqueteSeleccionado(false);
      setServiciosSeleccionados(prev => prev.filter(s => !paqueteServicios.servicios.includes(s)));
    } else {
      // Seleccionar paquete y agregar todos sus servicios
      setPaqueteSeleccionado(true);
      setServiciosSeleccionados(prev => [...new Set([...prev, ...paqueteServicios.servicios])]);
    }
  };

  const toggleProducto = (id: string) => {
    setProductosSeleccionados(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const calcularTotal = () => {
    const totalTerapias = terapiasSeleccionadas.reduce((acc, id) => {
      const terapia = terapias.find(t => t.id === id);
      return acc + (terapia?.precio || 0);
    }, 0);

    let totalServicios = 0;
    
    // Si el paquete está seleccionado, usar precio del paquete y restar servicios individuales
    if (paqueteSeleccionado) {
      totalServicios += esAfiliado ? paqueteServicios.precioAfiliado : paqueteServicios.precioParticular;
      // Los servicios del paquete ya están incluidos, no los contamos individualmente
      const serviciosIndividuales = serviciosSeleccionados.filter(s => !paqueteServicios.servicios.includes(s));
      totalServicios += serviciosIndividuales.reduce((acc, id) => {
        const servicio = serviciosAdicionales.find(s => s.id === id);
        const precio = esAfiliado ? servicio?.precioAfiliado : servicio?.precioParticular;
        return acc + (precio || 0);
      }, 0);
    } else {
      // Calcular servicios individuales
      totalServicios = serviciosSeleccionados.reduce((acc, id) => {
        const servicio = serviciosAdicionales.find(s => s.id === id);
        const precio = esAfiliado ? servicio?.precioAfiliado : servicio?.precioParticular;
        return acc + (precio || 0);
      }, 0);
    }

    // Productos del spa
    const totalProductos = productosSeleccionados.reduce((acc, id) => {
      const producto = productosSpa.find(p => p.id === id);
      return acc + (producto?.precio || 0);
    }, 0);

    return totalTerapias + totalServicios + totalProductos;
  };

  const calcularDuracionTotal = () => {
    return terapiasSeleccionadas.reduce((acc, id) => {
      const terapia = terapias.find(t => t.id === id);
      return acc + (terapia?.duracion || 0);
    }, 0);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    // Preparar datos de la reserva
    const reserva = {
      esAfiliado,
      afiliadoNombre: afiliadoNombre || null,
      terapias: terapiasSeleccionadas.map(id => terapias.find(t => t.id === id)),
      serviciosAdicionales: serviciosSeleccionados.map(id => serviciosAdicionales.find(s => s.id === id)),
      paqueteSeleccionado,
      productos: productosSeleccionados.map(id => productosSpa.find(p => p.id === id)),
      fecha,
      horario,
      duracionTotal: calcularDuracionTotal(),
      nombre,
      telefono,
      email,
      notas,
      metodoPago,
      total: calcularTotal(),
      fechaCreacion: new Date().toISOString()
    };

    try {
      // Enviar a la API
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reserva),
      });

      if (response.ok) {
        setSubmitting(false);
        setReservaExitosa(true);
      } else {
        alert('Error al procesar la reserva. Intenta nuevamente.');
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Intenta nuevamente.');
      setSubmitting(false);
    }
  };

  const resetearFormulario = () => {
    setPaso(1);
    setTerapiasSeleccionadas([]);
    setServiciosSeleccionados([]);
    setPaqueteSeleccionado(false);
    setProductosSeleccionados([]);
    setFecha('');
    setHorario('');
    setNombre('');
    setTelefono('');
    setEmail('');
    setNotas('');
    setMetodoPago('');
    setReservaExitosa(false);
  };

  if (reservaExitosa) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              ¡Reserva Confirmada! 🎉
            </h2>
            
            <p className="text-lg text-stone-600 mb-8">
              Hemos recibido tu solicitud de reserva para el <strong>{fecha}</strong> a las <strong>{horario}</strong>
            </p>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-[#3d2817] mb-4">Resumen de tu reserva:</h3>
              <div className="space-y-2 text-sm text-stone-600">
                <p><strong>Terapias:</strong> {terapiasSeleccionadas.length}</p>
                <p><strong>Duración total:</strong> {calcularDuracionTotal()} minutos</p>
                {productosSeleccionados.length > 0 && (
                  <p><strong>Productos:</strong> {productosSeleccionados.length}</p>
                )}
                <p><strong>Método de pago:</strong> {
                  metodoPago === 'wompi' ? '💳 Tarjeta (Wompi)' :
                  metodoPago === 'nequi' ? '📱 Nequi' :
                  metodoPago === 'efectivo' ? '💵 Efectivo' : 'No especificado'
                }</p>
                <p className="pt-2 border-t border-stone-300 mt-2"><strong>Total a pagar:</strong> ${calcularTotal().toLocaleString('es-CO')}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.link/mlbr4z?text=Hola, confirmo mi reserva para el ${fecha} a las ${horario}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Confirmar por WhatsApp
              </a>
              
              <button
                onClick={resetearFormulario}
                className="inline-block bg-stone-200 hover:bg-stone-300 text-[#3d2817] px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Nueva Reserva
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Reserva tu Cita
          </h1>
          {afiliadoNombre && (
            <div className="mb-4 inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full border-2 border-green-300">
              <span className="text-2xl">🏅</span>
              <p className="text-sm font-semibold text-[#3d2817]">
                Bienvenido, <span className="text-green-700">{afiliadoNombre}</span>
              </p>
              <span className="text-xs text-stone-600">(Descuentos activos)</span>
            </div>
          )}
          <p className="text-lg text-stone-600">
            Personaliza tu experiencia de bienestar
          </p>
        </div>

        {/* Indicador de pasos */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3, 4].map((num) => (
              <React.Fragment key={num}>
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all duration-300 ${
                  paso >= num ? 'bg-[#3d2817] text-white scale-110' : 'bg-stone-200 text-stone-500'
                }`}>
                  {num}
                </div>
                {num < 4 && (
                  <div className={`h-1 w-16 rounded transition-all duration-300 ${
                    paso > num ? 'bg-[#3d2817]' : 'bg-stone-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs md:text-sm text-stone-600 max-w-2xl mx-auto">
            <span className={paso === 1 ? 'font-bold text-[#3d2817]' : ''}>Tipo de cliente</span>
            <span className={paso === 2 ? 'font-bold text-[#3d2817]' : ''}>Terapias</span>
            <span className={paso === 3 ? 'font-bold text-[#3d2817]' : ''}>Fecha y hora</span>
            <span className={paso === 4 ? 'font-bold text-[#3d2817]' : ''}>Datos personales</span>
          </div>
        </div>

        {/* Contenido por pasos */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-12">
          {/* Paso 1: Tipo de cliente */}
          {paso === 1 && (
            <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#3d2817] text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                {esAfiliado ? '✅ Eres afiliado' : '¿Eres afiliado o particular?'}
              </h2>
              
              {!esAfiliado && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    <button
                      onClick={() => {
                        setEsAfiliado(true);
                        // Redirigir al login de afiliados
                        window.location.href = '/login/afiliados';
                      }}
                      className="group relative p-8 rounded-3xl border-4 transition-all duration-300 transform hover:scale-105 border-stone-200 hover:border-green-300"
                    >
                      <div className="text-6xl mb-4">🏅</div>
                      <h3 className="text-2xl font-bold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Soy Afiliado
                      </h3>
                      <p className="text-stone-600 mb-4">
                        Ingresa para activar tus descuentos
                      </p>
                      <p className="text-xs text-green-600 font-semibold">Iniciar sesión →</p>
                    </button>

                    <button
                      onClick={() => {
                        setEsAfiliado(false);
                        setPaso(2);
                      }}
                      className="group relative p-8 rounded-3xl border-4 transition-all duration-300 transform hover:scale-105 border-stone-200 hover:border-blue-300"
                    >
                      <div className="text-6xl mb-4">👤</div>
                      <h3 className="text-2xl font-bold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Particular
                      </h3>
                      <p className="text-stone-600 mb-4">
                        Acceso a todos nuestros servicios
                      </p>
                    </button>
                  </div>
                </>
              )}

              {esAfiliado && (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-300">
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">🏅</div>
                      <h3 className="text-2xl font-bold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                        ¡Descuentos Activados!
                      </h3>
                      <p className="text-stone-600">
                        Como afiliado, disfrutarás de precios especiales en servicios adicionales
                      </p>
                    </div>
                    <div className="text-center pt-4">
                      <button
                        onClick={() => setPaso(2)}
                        className="bg-[#3d2817] hover:bg-[#2d1f11] text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-110 shadow-xl"
                      >
                        Continuar →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Paso 2: Seleccionar terapias */}
          {paso === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Selecciona tus terapias
                </h2>
                <p className="text-stone-600">Puedes elegir múltiples servicios</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {terapias.map((terapia) => (
                  <button
                    key={terapia.id}
                    onClick={() => toggleTerapia(terapia.id)}
                    className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-105 ${
                      terapiasSeleccionadas.includes(terapia.id)
                        ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg'
                        : 'border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-4xl">{terapia.icon}</span>
                      {terapiasSeleccionadas.includes(terapia.id) && (
                        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold text-[#3d2817] text-sm mb-2">{terapia.nombre}</h4>
                    <div className="flex items-center justify-between text-xs text-stone-600">
                      <span>{terapia.duracion} min</span>
                      <span className="font-bold text-amber-700">${terapia.precio.toLocaleString('es-CO')}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Servicios adicionales */}
              <div className="border-t-2 border-stone-200 pt-8">
                <h3 className="text-xl md:text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Servicios Adicionales
                </h3>
                
                {/* Paquete de servicios */}
                <div className="mb-6">
                  <button
                    onClick={togglePaquete}
                    className={`w-full p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      paqueteSeleccionado
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                        : 'border-stone-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{paqueteServicios.icon}</div>
                        <div className="text-left">
                          <p className="font-semibold text-[#3d2817] mb-1">{paqueteServicios.nombre}</p>
                          <p className="text-xs text-stone-600">Incluye: Sauna + Jacuzzi + Baño Turco</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-700">
                          ${(esAfiliado ? paqueteServicios.precioAfiliado : paqueteServicios.precioParticular).toLocaleString('es-CO')}
                        </p>
                        {paqueteSeleccionado && (
                          <div className="mt-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-white">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Servicios individuales */}
                <p className="text-sm text-stone-600 mb-3">O selecciona servicios individuales:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {serviciosAdicionales.map((servicio) => (
                    <button
                      key={servicio.id}
                      onClick={() => toggleServicio(servicio.id)}
                      disabled={paqueteSeleccionado && paqueteServicios.servicios.includes(servicio.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        serviciosSeleccionados.includes(servicio.id)
                          ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                          : 'border-stone-200 hover:border-green-300'
                      } ${
                        paqueteSeleccionado && paqueteServicios.servicios.includes(servicio.id)
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      <div className="text-3xl mb-2">{servicio.icon}</div>
                      <p className="text-xs font-semibold text-[#3d2817] mb-1">{servicio.nombre}</p>
                      <p className="text-xs font-bold text-green-700">
                        ${(esAfiliado ? servicio.precioAfiliado : servicio.precioParticular).toLocaleString('es-CO')}
                      </p>
                      {paqueteSeleccionado && paqueteServicios.servicios.includes(servicio.id) && (
                        <div className="absolute top-2 right-2 text-xs bg-green-500 text-white px-2 py-1 rounded">
                          Incluido
                        </div>
                      )}
                      {serviciosSeleccionados.includes(servicio.id) && !(paqueteSeleccionado && paqueteServicios.servicios.includes(servicio.id)) && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Productos del Spa */}
                <div className="mt-8 border-t-2 border-stone-200 pt-8">
                  <h4 className="text-lg font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Productos del Spa
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {productosSpa.map((producto) => (
                      <button
                        key={producto.id}
                        onClick={() => toggleProducto(producto.id)}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                          productosSeleccionados.includes(producto.id)
                            ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg'
                            : 'border-stone-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="text-3xl mb-2">{producto.icon}</div>
                        <p className="text-xs font-semibold text-[#3d2817] mb-1">{producto.nombre}</p>
                        <p className="text-xs font-bold text-amber-700">
                          ${producto.precio.toLocaleString('es-CO')}
                        </p>
                        {productosSeleccionados.includes(producto.id) && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 text-white">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botón Conocer Terapias */}
              <div className="text-center pt-6">
                <Link
                  href="/servicios"
                  className="inline-flex items-center gap-2 text-[#3d2817] hover:text-[color:var(--oliva-400)] font-semibold transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  Conocer más terapias
                </Link>
              </div>

              {/* Resumen */}
              {(terapiasSeleccionadas.length > 0 || serviciosSeleccionados.length > 0 || productosSeleccionados.length > 0) && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-[#3d2817] mb-3">Resumen de selección:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-stone-600">Terapias:</p>
                      <p className="font-bold text-[#3d2817]">{terapiasSeleccionadas.length}</p>
                    </div>
                    <div>
                      <p className="text-stone-600">Duración total:</p>
                      <p className="font-bold text-[#3d2817]">{calcularDuracionTotal()} min</p>
                    </div>
                    <div>
                      <p className="text-stone-600">Servicios adicionales:</p>
                      <p className="font-bold text-[#3d2817]">
                        {paqueteSeleccionado ? '1 paquete' : serviciosSeleccionados.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-stone-600">Productos:</p>
                      <p className="font-bold text-[#3d2817]">{productosSeleccionados.length}</p>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-stone-300">
                      <p className="text-stone-600">Total:</p>
                      <p className="font-bold text-2xl text-amber-700">${calcularTotal().toLocaleString('es-CO')}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center pt-4">
                <button
                  onClick={() => setPaso(1)}
                  className="bg-stone-200 hover:bg-stone-300 text-[#3d2817] px-8 py-4 rounded-full font-semibold transition-all duration-300"
                >
                  ← Atrás
                </button>
                <button
                  onClick={() => setPaso(3)}
                  disabled={terapiasSeleccionadas.length === 0}
                  className="bg-[#3d2817] hover:bg-[#2d1f11] text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-110 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* Paso 3: Fecha y Hora */}
          {paso === 3 && (
            <div className="space-y-8 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-[#3d2817] text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                Selecciona fecha y hora
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    📅 Fecha de la cita
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-6 py-4 rounded-xl border-2 border-stone-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none text-lg"
                  />
                  {fecha && !esDiaValido(fecha) && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      Lo sentimos, estamos cerrados los lunes, martes y miércoles. Por favor selecciona otro día.
                    </p>
                  )}
                  <p className="mt-2 text-xs text-stone-500">
                    🕗 Horario: Jueves a Domingo de 8:00 AM a 3:30 PM
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    🕐 Hora de inicio
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {horariosDisponibles.map((hora) => (
                      <button
                        key={hora}
                        onClick={() => setHorario(hora)}
                        disabled={!esDiaValido(fecha) || !fecha}
                        className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                          horario === hora
                            ? 'bg-[#3d2817] text-white shadow-lg scale-105'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed'
                        }`}
                      >
                        {hora}
                      </button>
                    ))}
                  </div>
                  {horario && (
                    <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                      <p className="text-sm text-green-800">
                        ✅ Tu cita comenzará a las <strong>{horario}</strong> y durará aproximadamente <strong>{calcularDuracionTotal()} minutos</strong>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <button
                  onClick={() => setPaso(2)}
                  className="bg-stone-200 hover:bg-stone-300 text-[#3d2817] px-8 py-4 rounded-full font-semibold transition-all duration-300"
                >
                  ← Atrás
                </button>
                <button
                  onClick={() => setPaso(4)}
                  disabled={!fecha || !horario || !esDiaValido(fecha)}
                  className="bg-[#3d2817] hover:bg-[#2d1f11] text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-110 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* Paso 4: Datos personales */}
          {paso === 4 && (
            <div className="space-y-8 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-[#3d2817] text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                Completa tus datos
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    👤 Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: María Rodríguez"
                    className="w-full px-6 py-4 rounded-xl border-2 border-stone-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    📱 Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej: +57 300 123 4567"
                    className="w-full px-6 py-4 rounded-xl border-2 border-stone-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none"
                  />
                  <p className="mt-2 text-xs text-stone-500">
                    Te contactaremos por este número para confirmar tu cita
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    📧 Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ej: maria@email.com"
                    className="w-full px-6 py-4 rounded-xl border-2 border-stone-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    📝 Notas adicionales / Observaciones (opcional)
                  </label>
                  <textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="¿Tienes alguna condición especial, preferencia o observación que debamos saber?"
                    rows={4}
                    className="w-full px-6 py-4 rounded-xl border-2 border-stone-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none resize-none"
                  />
                </div>

                {/* Método de Pago */}
                <div>
                  <label className="block text-sm font-semibold text-[#3d2817] mb-4">
                    💳 Método de Pago *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setMetodoPago('wompi')}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        metodoPago === 'wompi'
                          ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                          : 'border-stone-200 hover:border-green-300'
                      }`}
                    >
                      <div className="text-4xl mb-2">💳</div>
                      <p className="font-semibold text-[#3d2817] mb-1">Tarjeta de Crédito/Débito</p>
                      <p className="text-xs text-stone-600">Wompi</p>
                      {metodoPago === 'wompi' && (
                        <div className="mt-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setMetodoPago('nequi')}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        metodoPago === 'nequi'
                          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                          : 'border-stone-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-4xl mb-2">📱</div>
                      <p className="font-semibold text-[#3d2817] mb-1">Nequi</p>
                      <p className="text-xs text-stone-600">Pago móvil</p>
                      {metodoPago === 'nequi' && (
                        <div className="mt-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setMetodoPago('efectivo')}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        metodoPago === 'efectivo'
                          ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg'
                          : 'border-stone-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="text-4xl mb-2">💵</div>
                      <p className="font-semibold text-[#3d2817] mb-1">Efectivo</p>
                      <p className="text-xs text-stone-600">Pago en el spa</p>
                      {metodoPago === 'efectivo' && (
                        <div className="mt-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center mx-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-stone-500">
                    * Si eliges Wompi o Nequi, te enviaremos el link de pago después de confirmar tu reserva
                  </p>
                </div>
              </div>

              {/* Resumen final */}
              <div className="bg-gradient-to-br from-[#3d2817] to-[#2d1f11] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  📋 Resumen de tu Reserva
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start pb-4 border-b border-white/20">
                    <div>
                      <p className="text-sm text-white/70">Tipo de cliente</p>
                      <p className="font-semibold">{esAfiliado ? '🏅 Afiliado' : '👤 Particular'}</p>
                    </div>
                  </div>

                  <div className="pb-4 border-b border-white/20">
                    <p className="text-sm text-white/70 mb-2">Terapias seleccionadas</p>
                    <div className="space-y-1">
                      {terapiasSeleccionadas.map(id => {
                        const terapia = terapias.find(t => t.id === id);
                        return (
                          <div key={id} className="flex justify-between text-sm">
                            <span>{terapia?.icon} {terapia?.nombre}</span>
                            <span>${terapia?.precio.toLocaleString('es-CO')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {paqueteSeleccionado && (
                    <div className="pb-4 border-b border-white/20">
                      <p className="text-sm text-white/70 mb-2">Paquete de servicios</p>
                      <div className="flex justify-between text-sm">
                        <span>{paqueteServicios.icon} {paqueteServicios.nombre}</span>
                        <span>${(esAfiliado ? paqueteServicios.precioAfiliado : paqueteServicios.precioParticular).toLocaleString('es-CO')}</span>
                      </div>
                    </div>
                  )}

                  {serviciosSeleccionados.filter(s => !(paqueteSeleccionado && paqueteServicios.servicios.includes(s))).length > 0 && (
                    <div className="pb-4 border-b border-white/20">
                      <p className="text-sm text-white/70 mb-2">Servicios adicionales individuales</p>
                      <div className="space-y-1">
                        {serviciosSeleccionados.filter(s => !(paqueteSeleccionado && paqueteServicios.servicios.includes(s))).map(id => {
                          const servicio = serviciosAdicionales.find(s => s.id === id);
                          const precio = esAfiliado ? servicio?.precioAfiliado : servicio?.precioParticular;
                          return (
                            <div key={id} className="flex justify-between text-sm">
                              <span>{servicio?.icon} {servicio?.nombre}</span>
                              <span>${precio?.toLocaleString('es-CO')}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {productosSeleccionados.length > 0 && (
                    <div className="pb-4 border-b border-white/20">
                      <p className="text-sm text-white/70 mb-2">Productos del spa</p>
                      <div className="space-y-1">
                        {productosSeleccionados.map(id => {
                          const producto = productosSpa.find(p => p.id === id);
                          return (
                            <div key={id} className="flex justify-between text-sm">
                              <span>{producto?.icon} {producto?.nombre}</span>
                              <span>${producto?.precio.toLocaleString('es-CO')}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {metodoPago && (
                    <div className="pb-4 border-b border-white/20">
                      <p className="text-sm text-white/70">Método de pago</p>
                      <p className="font-semibold">
                        {metodoPago === 'wompi' && '💳 Tarjeta (Wompi)'}
                        {metodoPago === 'nequi' && '📱 Nequi'}
                        {metodoPago === 'efectivo' && '💵 Efectivo'}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-4 border-t-2 border-white/40">
                    <div>
                      <p className="text-sm text-white/70">Fecha y hora</p>
                      <p className="font-semibold">{fecha} a las {horario}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t-2 border-white/40">
                    <p className="text-xl font-bold">TOTAL</p>
                    <p className="text-3xl font-bold text-amber-400">${calcularTotal().toLocaleString('es-CO')}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <button
                  onClick={() => setPaso(3)}
                  className="bg-stone-200 hover:bg-stone-300 text-[#3d2817] px-8 py-4 rounded-full font-semibold transition-all duration-300"
                >
                  ← Atrás
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!nombre || !telefono || !metodoPago || submitting}
                  className="relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-110 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    '✅ Confirmar Reserva'
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-stone-500 mt-4">
                Al confirmar, aceptas nuestras políticas de cancelación y reagendamiento (24 horas de anticipación)
              </p>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-[#3d2817] mb-2">Llega 20 min antes</h3>
            <p className="text-sm text-stone-600">Para completar tu registro y cambiarte con calma</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-[#3d2817] mb-2">Confirmación inmediata</h3>
            <p className="text-sm text-stone-600">Te contactaremos por WhatsApp para confirmar</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-amber-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <h3 className="font-semibold text-[#3d2817] mb-2">Cancela con 24h</h3>
            <p className="text-sm text-stone-600">Reagenda sin costo con anticipación</p>
          </div>
        </div>
      </div>
    </main>
  );
}
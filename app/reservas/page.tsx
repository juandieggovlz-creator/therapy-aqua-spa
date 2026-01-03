"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type TerapiaItem = {
  id: string;
  nombre: string;
  duracion: number;
  precio: number;
  precioOriginal?: number;
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

const paqueteServicios = {
  id: 'paquete-relajacion',
  nombre: 'Paquete Relajación (Sauna + Jacuzzi + Turco)',
  precioAfiliado: 13000,
  precioParticular: 20000,
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

function ReservasContentInner() {
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
  const [promocion, setPromocion] = useState<any>(null);
  const [descuentosServicios, setDescuentosServicios] = useState<Record<string, number>>({});
  const [terapiasActualizadas, setTerapiasActualizadas] = useState<TerapiaItem[]>(terapias);

  const diasCerrados = [1, 2, 3];
  const [servicioPrecargado, setServicioPrecargado] = useState(false);

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

    // Cargar promoción, descuentos y servicios actualizados
    const loadPromocion = async () => {
      try {
        const [promocionRes, descuentosRes, serviciosRes] = await Promise.all([
          fetch('/api/admin/promociones'),
          fetch('/api/admin/descuentos'),
          fetch('/api/servicios')
        ]);
        const promocionData = await promocionRes.json();
        const descuentosData = await descuentosRes.json();
        const serviciosData = await serviciosRes.json();
        
        setPromocion(promocionData.promocion);
        setDescuentosServicios(descuentosData.descuentos || {});
        
        // Actualizar terapias con precios y descuentos desde la API
        if (serviciosData.servicios) {
          const terapiasConPrecios = terapias.map(terapia => {
            const servicioAPI = serviciosData.servicios.find((s: any) => s.id === terapia.id);
            if (servicioAPI) {
              return {
                ...terapia,
                precio: servicioAPI.precio,
                precioOriginal: servicioAPI.precioOriginal || servicioAPI.precio
              };
            }
            return terapia;
          });
          setTerapiasActualizadas(terapiasConPrecios);
        }
      } catch (error) {
        console.error('Error cargando promoción:', error);
      }
    };
    loadPromocion();
  }, []);

  useEffect(() => {
    const servicioParam = searchParams?.get('servicio');
    // Solo precargar si hay un parámetro, no se ha precargado antes, y no hay terapias seleccionadas
    if (servicioParam && !servicioPrecargado && terapiasSeleccionadas.length === 0) {
      const terapia = terapiasActualizadas.find(t => t.id === servicioParam);
      if (terapia) {
        setTerapiasSeleccionadas([terapia.id]);
        setPaso(2);
        setServicioPrecargado(true); // Marcar como precargado para evitar que se vuelva a ejecutar
      }
    }
  }, [searchParams, servicioPrecargado, terapiasActualizadas]);

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
      setPaqueteSeleccionado(false);
      setServiciosSeleccionados(prev => prev.filter(s => !paqueteServicios.servicios.includes(s)));
    } else {
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
      const terapia = terapiasActualizadas.find(t => t.id === id);
      if (!terapia) return acc;
      
      const precioOriginal = terapia.precioOriginal || terapia.precio;
      let precio = terapia.precio;
      
      // Aplicar descuento individual si existe
      if (descuentosServicios[id]) {
        precio = precioOriginal * (1 - descuentosServicios[id] / 100);
      }
      // Aplicar promoción general si está activa y no hay descuento individual
      else if (promocion?.activa) {
        precio = precioOriginal * (1 - promocion.descuento / 100);
      }
      
      return acc + precio;
    }, 0);

    let totalServicios = 0;
    
    if (paqueteSeleccionado) {
      totalServicios += esAfiliado ? paqueteServicios.precioAfiliado : paqueteServicios.precioParticular;
      const serviciosIndividuales = serviciosSeleccionados.filter(s => !paqueteServicios.servicios.includes(s));
      totalServicios += serviciosIndividuales.reduce((acc, id) => {
        const servicio = serviciosAdicionales.find(s => s.id === id);
        const precio = esAfiliado ? servicio?.precioAfiliado : servicio?.precioParticular;
        return acc + (precio || 0);
      }, 0);
    } else {
      totalServicios = serviciosSeleccionados.reduce((acc, id) => {
        const servicio = serviciosAdicionales.find(s => s.id === id);
        const precio = esAfiliado ? servicio?.precioAfiliado : servicio?.precioParticular;
        return acc + (precio || 0);
      }, 0);
    }

    const totalProductos = productosSeleccionados.reduce((acc, id) => {
      const producto = productosSpa.find(p => p.id === id);
      return acc + (producto?.precio || 0);
    }, 0);

    return totalTerapias + totalServicios + totalProductos;
  };

  const calcularDuracionTotal = () => {
    return terapiasSeleccionadas.reduce((acc, id) => {
      const terapia = terapiasActualizadas.find(t => t.id === id);
      return acc + (terapia?.duracion || 0);
    }, 0);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    const reserva = {
      esAfiliado,
      afiliadoNombre: afiliadoNombre || null,
      terapias: terapiasSeleccionadas.map(id => terapiasActualizadas.find(t => t.id === id)),
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
      const response = await fetch('/api/bookings', {
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
    setServicioPrecargado(false); // Resetear el flag de precarga
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

        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-12">
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

          {paso === 2 && (
            <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#3d2817] text-center mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Selecciona tus Terapias
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto p-2">
                {terapiasActualizadas.map((terapia) => (
                  <button
                    key={terapia.id}
                    onClick={() => toggleTerapia(terapia.id)}
                    className={`group relative p-6 rounded-2xl border-4 transition-all duration-300 text-left ${
                      terapiasSeleccionadas.includes(terapia.id)
                        ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-stone-100 shadow-xl ring-4 ring-amber-200 ring-opacity-50'
                        : 'border-stone-200 hover:border-amber-300 bg-white hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0">{terapia.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#3d2817] mb-2 text-sm md:text-base leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {terapia.nombre}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-stone-600">⏱️ {terapia.duracion} min</span>
                          <div className="text-right">
                            {(() => {
                              const precioOriginal = terapia.precioOriginal || terapia.precio;
                              let precioFinal = terapia.precio;
                              let descuentoAplicado = 0;
                              
                              if (descuentosServicios[terapia.id]) {
                                descuentoAplicado = descuentosServicios[terapia.id];
                                precioFinal = precioOriginal * (1 - descuentoAplicado / 100);
                              } else if (promocion?.activa) {
                                descuentoAplicado = promocion.descuento;
                                precioFinal = precioOriginal * (1 - descuentoAplicado / 100);
                              }
                              
                              return (
                                <>
                                  {descuentoAplicado > 0 && (
                                    <div className="text-xs text-red-600 font-semibold mb-1">
                                      -{descuentoAplicado}% OFF
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    {descuentoAplicado > 0 && (
                                      <span className="text-xs text-stone-400 line-through">
                                        ${precioOriginal.toLocaleString('es-CO')}
                                      </span>
                                    )}
                                    <span className="text-sm font-bold text-[#3d2817]">
                                      ${Math.round(precioFinal).toLocaleString('es-CO')}
                                    </span>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        terapiasSeleccionadas.includes(terapia.id)
                          ? 'border-[#3d2817] bg-[#3d2817]'
                          : 'border-stone-300'
                      }`}>
                        {terapiasSeleccionadas.includes(terapia.id) && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {(terapiasSeleccionadas.length > 0 || paqueteSeleccionado || productosSeleccionados.length > 0) ? (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#3d2817] text-lg">Resumen de selección:</h3>
                    <span className="text-sm text-stone-600">
                      {terapiasSeleccionadas.length} terapia(s) • {paqueteSeleccionado ? '1 paquete' : '0 paquetes'} • {productosSeleccionados.length} producto(s)
                    </span>
                  </div>
                  
                  {/* Terapias */}
                  {terapiasSeleccionadas.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-stone-600 mb-2 uppercase">Terapias:</p>
                      <div className="space-y-2">
                        {terapiasSeleccionadas.map((id) => {
                          const terapia = terapiasActualizadas.find(t => t.id === id);
                          return terapia ? (
                            <div key={id} className="flex items-center justify-between bg-white rounded-lg p-3">
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-2xl">{terapia.icon}</span>
                                <span className="text-sm font-semibold text-[#3d2817]">{terapia.nombre}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                {(() => {
                                  const precioOriginal = terapia.precioOriginal || terapia.precio;
                                  let precioFinal = terapia.precio;
                                  let descuentoAplicado = 0;
                                  
                                  if (descuentosServicios[id]) {
                                    descuentoAplicado = descuentosServicios[id];
                                    precioFinal = precioOriginal * (1 - descuentoAplicado / 100);
                                  } else if (promocion?.activa) {
                                    descuentoAplicado = promocion.descuento;
                                    precioFinal = precioOriginal * (1 - descuentoAplicado / 100);
                                  }
                                  
                                  return (
                                    <div className="text-right">
                                      {descuentoAplicado > 0 && (
                                        <div className="text-xs text-red-600 font-semibold mb-1">
                                          -{descuentoAplicado}% OFF
                                        </div>
                                      )}
                                      <div className="flex items-center gap-2">
                                        {descuentoAplicado > 0 && (
                                          <span className="text-xs text-stone-400 line-through">
                                            ${(terapia.precioOriginal || terapia.precio).toLocaleString('es-CO')}
                                          </span>
                                        )}
                                        <span className="text-sm font-bold text-[#3d2817]">
                                          ${Math.round(precioFinal).toLocaleString('es-CO')}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })()}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTerapia(id);
                                  }}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                  title="Quitar terapia"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {/* Paquete */}
                  {paqueteSeleccionado && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-stone-600 mb-2 uppercase">Servicios Adicionales:</p>
                      <div className="flex items-center justify-between bg-white rounded-lg p-3">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-2xl">{paqueteServicios.icon}</span>
                          <span className="text-sm font-semibold text-[#3d2817]">{paqueteServicios.nombre}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-[#3d2817]">
                            ${(esAfiliado ? paqueteServicios.precioAfiliado : paqueteServicios.precioParticular).toLocaleString('es-CO')}
                          </span>
                          <button
                            onClick={togglePaquete}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Quitar paquete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Productos */}
                  {productosSeleccionados.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-stone-600 mb-2 uppercase">Productos:</p>
                      <div className="space-y-2">
                        {productosSeleccionados.map((id) => {
                          const producto = productosSpa.find(p => p.id === id);
                          return producto ? (
                            <div key={id} className="flex items-center justify-between bg-white rounded-lg p-3">
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-2xl">{producto.icon}</span>
                                <span className="text-sm font-semibold text-[#3d2817]">{producto.nombre}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-[#3d2817]">${producto.precio.toLocaleString('es-CO')}</span>
                                <button
                                  onClick={() => toggleProducto(id)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                  title="Quitar producto"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t-2 border-amber-300">
                    <div>
                      <p className="text-sm text-stone-600">Duración total:</p>
                      <p className="text-lg font-bold text-[#3d2817]">{calcularDuracionTotal()} minutos</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-stone-600">Total a pagar:</p>
                      <p className="text-2xl font-bold text-[#3d2817]">${calcularTotal().toLocaleString('es-CO')}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-stone-50 rounded-2xl p-6 border-2 border-stone-200 text-center">
                  <p className="text-stone-600 mb-2">💡 Selecciona una o más terapias haciendo clic en las tarjetas</p>
                  <p className="text-sm text-stone-500">Puedes seleccionar múltiples terapias para tu sesión</p>
                </div>
              )}

              {/* Servicios Adicionales - Paquete */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  💆 Servicios Adicionales
                </h3>
                <button
                  onClick={togglePaquete}
                  className={`w-full p-6 rounded-xl border-4 transition-all duration-300 text-left ${
                    paqueteSeleccionado
                      ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg'
                      : 'border-stone-200 hover:border-amber-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{paqueteServicios.icon}</span>
                      <div>
                        <h4 className="font-bold text-[#3d2817] text-lg mb-1">{paqueteServicios.nombre}</h4>
                        <p className="text-sm text-stone-600">Incluye: Sauna + Jacuzzi + Baño Turco</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-stone-600 mb-1">
                        {esAfiliado ? 'Precio afiliado' : 'Precio particular'}
                      </p>
                      <p className="text-2xl font-bold text-[#3d2817]">
                        ${(esAfiliado ? paqueteServicios.precioAfiliado : paqueteServicios.precioParticular).toLocaleString('es-CO')}
                      </p>
                      <div className={`mt-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        paqueteSeleccionado
                          ? 'border-amber-500 bg-amber-500'
                          : 'border-stone-300'
                      }`}>
                        {paqueteSeleccionado && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Productos del Spa */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                <h3 className="text-xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  🛍️ Productos Adicionales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productosSpa.map((producto) => (
                    <button
                      key={producto.id}
                      onClick={() => toggleProducto(producto.id)}
                      className={`p-4 rounded-xl border-4 transition-all duration-300 text-left ${
                        productosSeleccionados.includes(producto.id)
                          ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg'
                          : 'border-stone-200 hover:border-amber-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{producto.icon}</span>
                          <div>
                            <h4 className="font-bold text-[#3d2817]">{producto.nombre}</h4>
                            <p className="text-sm font-bold text-amber-700 mt-1">
                              ${producto.precio.toLocaleString('es-CO')}
                            </p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          productosSeleccionados.includes(producto.id)
                            ? 'border-amber-500 bg-amber-500'
                            : 'border-stone-300'
                        }`}>
                          {productosSeleccionados.includes(producto.id) && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
                <button
                  onClick={() => setPaso(1)}
                  className="bg-stone-200 hover:bg-stone-300 text-[#3d2817] px-8 py-3 rounded-full font-semibold transition-all duration-300"
                >
                  ← Volver
                </button>
                <button
                  onClick={() => setPaso(3)}
                  disabled={terapiasSeleccionadas.length === 0}
                  className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                    terapiasSeleccionadas.length === 0
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : 'bg-[#3d2817] hover:bg-[#2d1f11] text-white shadow-lg'
                  }`}
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {paso === 3 && (
            <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#3d2817] text-center mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Selecciona Fecha y Hora
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-lg font-semibold text-[#3d2817] mb-4">
                    📅 Fecha
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full p-4 rounded-2xl border-4 text-lg ${
                      fecha && !esDiaValido(fecha)
                        ? 'border-red-300 bg-red-50'
                        : 'border-stone-200 focus:border-[#3d2817]'
                    }`}
                  />
                  {fecha && !esDiaValido(fecha) && (
                    <p className="mt-2 text-sm text-red-600">⚠️ Los lunes, martes y miércoles estamos cerrados</p>
                  )}
                </div>

                <div>
                  <label className="block text-lg font-semibold text-[#3d2817] mb-4">
                    ⏰ Horario
                  </label>
                  <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-2">
                    {horariosDisponibles.map((horarioItem) => (
                      <button
                        key={horarioItem}
                        onClick={() => setHorario(horarioItem)}
                        className={`p-3 rounded-xl border-2 transition-all duration-300 font-semibold ${
                          horario === horarioItem
                            ? 'border-[#3d2817] bg-[#3d2817] text-white'
                            : 'border-stone-200 hover:border-amber-300 bg-white text-[#3d2817]'
                        }`}
                      >
                        {horarioItem}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
                <button
                  onClick={() => setPaso(2)}
                  className="bg-stone-200 hover:bg-stone-300 text-[#3d2817] px-8 py-3 rounded-full font-semibold transition-all duration-300"
                >
                  ← Volver
                </button>
                <button
                  onClick={() => setPaso(4)}
                  disabled={!fecha || !horario || !esDiaValido(fecha)}
                  className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                    !fecha || !horario || !esDiaValido(fecha)
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : 'bg-[#3d2817] hover:bg-[#2d1f11] text-white shadow-lg'
                  }`}
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {paso === 4 && (
            <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#3d2817] text-center mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Completa tus Datos
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full p-4 rounded-xl border-2 border-stone-200 focus:border-[#3d2817] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full p-4 rounded-xl border-2 border-stone-200 focus:border-[#3d2817] focus:outline-none"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 rounded-xl border-2 border-stone-200 focus:border-[#3d2817] focus:outline-none"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    Método de pago *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: 'wompi', label: '💳 Tarjeta (Wompi)', desc: 'Pago con tarjeta' },
                      { id: 'nequi', label: '📱 Nequi', desc: 'Transferencia Nequi' },
                      { id: 'efectivo', label: '💵 Efectivo', desc: 'Pago en el lugar' }
                    ].map((metodo) => (
                      <button
                        key={metodo.id}
                        onClick={() => setMetodoPago(metodo.id)}
                        className={`p-4 rounded-xl border-4 transition-all duration-300 text-left ${
                          metodoPago === metodo.id
                            ? 'border-[#3d2817] bg-gradient-to-br from-amber-50 to-stone-100'
                            : 'border-stone-200 hover:border-amber-300 bg-white'
                        }`}
                      >
                        <div className="font-semibold text-[#3d2817] mb-1">{metodo.label}</div>
                        <div className="text-xs text-stone-600">{metodo.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    rows={4}
                    className="w-full p-4 rounded-xl border-2 border-stone-200 focus:border-[#3d2817] focus:outline-none resize-none"
                    placeholder="Comparte cualquier información adicional que consideres importante..."
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
                <h3 className="font-bold text-[#3d2817] text-lg mb-4">Resumen de tu reserva:</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-sm text-stone-600 mb-1"><strong>📅 Fecha:</strong> {fecha}</p>
                    <p className="text-sm text-stone-600"><strong>⏰ Hora:</strong> {horario}</p>
                  </div>

                  {/* Terapias */}
                  {terapiasSeleccionadas.length > 0 && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs font-semibold text-stone-600 mb-2 uppercase">Terapias ({terapiasSeleccionadas.length}):</p>
                      <div className="space-y-2">
                        {terapiasSeleccionadas.map((id) => {
                          const terapia = terapiasActualizadas.find(t => t.id === id);
                          return terapia ? (
                            <div key={id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span>{terapia.icon}</span>
                                <span className="text-[#3d2817]">{terapia.nombre}</span>
                              </div>
                              {(() => {
                                const precioOriginal = terapia.precioOriginal || terapia.precio;
                                let precioFinal = terapia.precio;
                                let descuentoAplicado = 0;
                                
                                if (descuentosServicios[id]) {
                                  descuentoAplicado = descuentosServicios[id];
                                  precioFinal = precioOriginal * (1 - descuentoAplicado / 100);
                                } else if (promocion?.activa) {
                                  descuentoAplicado = promocion.descuento;
                                  precioFinal = precioOriginal * (1 - descuentoAplicado / 100);
                                }
                                
                                return (
                                  <div className="text-right">
                                    {descuentoAplicado > 0 && (
                                      <span className="text-xs text-stone-400 line-through block">
                                        ${precioOriginal.toLocaleString('es-CO')}
                                      </span>
                                    )}
                                    <span className="font-bold text-[#3d2817]">
                                      ${Math.round(precioFinal).toLocaleString('es-CO')}
                                    </span>
                                    {descuentoAplicado > 0 && (
                                      <span className="text-xs text-red-600 font-semibold block">
                                        -{descuentoAplicado}% OFF
                                      </span>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {/* Paquete */}
                  {paqueteSeleccionado && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs font-semibold text-stone-600 mb-2 uppercase">Servicios Adicionales:</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span>{paqueteServicios.icon}</span>
                          <span className="text-[#3d2817]">{paqueteServicios.nombre}</span>
                        </div>
                        <span className="font-bold text-[#3d2817]">
                          ${(esAfiliado ? paqueteServicios.precioAfiliado : paqueteServicios.precioParticular).toLocaleString('es-CO')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Productos */}
                  {productosSeleccionados.length > 0 && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs font-semibold text-stone-600 mb-2 uppercase">Productos ({productosSeleccionados.length}):</p>
                      <div className="space-y-2">
                        {productosSeleccionados.map((id) => {
                          const producto = productosSpa.find(p => p.id === id);
                          return producto ? (
                            <div key={id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span>{producto.icon}</span>
                                <span className="text-[#3d2817]">{producto.nombre}</span>
                              </div>
                              <span className="font-bold text-[#3d2817]">${producto.precio.toLocaleString('es-CO')}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {/* Duración total */}
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-sm text-stone-600"><strong>⏱️ Duración total:</strong> {calcularDuracionTotal()} minutos</p>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-amber-300">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-[#3d2817]">Total a pagar:</span>
                    <span className="text-3xl font-bold text-[#3d2817]">${calcularTotal().toLocaleString('es-CO')}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
                <button
                  onClick={() => setPaso(3)}
                  className="bg-stone-200 hover:bg-stone-300 text-[#3d2817] px-8 py-3 rounded-full font-semibold transition-all duration-300"
                >
                  ← Volver
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !nombre || !telefono || !email || !metodoPago}
                  className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                    submitting || !nombre || !telefono || !email || !metodoPago
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : 'bg-[#3d2817] hover:bg-[#2d1f11] text-white shadow-lg'
                  }`}
                >
                  {submitting ? 'Procesando...' : 'Confirmar Reserva'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ReservasContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2817] mx-auto mb-4"></div>
          <p className="text-stone-600">Cargando...</p>
        </div>
      </div>
    }>
      <ReservasContentInner />
    </Suspense>
  );
}
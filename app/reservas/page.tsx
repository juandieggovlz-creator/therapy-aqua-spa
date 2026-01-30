"use client";

import React, { useState, useEffect, Suspense } from 'react';
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

function ReservasContent() {
  const searchParams = useSearchParams();
  
  // Estados para datos cargados desde la base de datos
  const [terapias, setTerapias] = useState<TerapiaItem[]>([]);
  const [serviciosAdicionales, setServiciosAdicionales] = useState<ServicioAdicional[]>([]);
  const [productosSpa, setProductosSpa] = useState<ProductoSpa[]>([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  
  const [paso, setPaso] = useState(1);
  const [esAfiliado, setEsAfiliado] = useState(false);
  const [afiliadoNombre, setAfiliadoNombre] = useState<string | null>(null);
  const [terapiasSeleccionadas, setTerapiasSeleccionadas] = useState<string[]>([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<string[]>([]);
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

  const diasCerrados = [1, 2, 3];

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

  // Cargar datos desde la base de datos
  useEffect(() => {
    const cargarDatos = async () => {
      setCargandoDatos(true);
      try {
        // Cargar servicios (terapias)
        const resServicios = await fetch('/api/servicios');
        const dataServicios = await resServicios.json();
        setTerapias((dataServicios.servicios || []).map((s: any) => ({
          id: s.servicio_id,
          nombre: s.nombre,
          duracion: s.duracion,
          precio: parseFloat(s.precio),
          icon: s.icon || '💆'
        })));

        // Cargar servicios adicionales
        const resAdicionales = await fetch('/api/servicios-adicionales');
        const dataAdicionales = await resAdicionales.json();
        setServiciosAdicionales((dataAdicionales.servicios || []).map((s: any) => ({
          id: s.servicio_id,
          nombre: s.nombre,
          precioAfiliado: parseFloat(s.precio_afiliado),
          precioParticular: parseFloat(s.precio_particular),
          icon: s.icon || '✨'
        })));

        // Cargar productos
        const resProductos = await fetch('/api/productos');
        const dataProductos = await resProductos.json();
        setProductosSpa((dataProductos.productos || []).map((p: any) => ({
          id: p.producto_id,
          nombre: p.nombre,
          precio: parseFloat(p.precio),
          icon: p.icon || '🛍️'
        })));

        // Cargar horarios
        const resHorarios = await fetch('/api/horarios');
        const dataHorarios = await resHorarios.json();
        setHorariosDisponibles((dataHorarios.horarios || []).map((h: any) => h.hora));
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setCargandoDatos(false);
      }
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    const servicioParam = searchParams?.get('servicio');
    if (servicioParam && terapiasSeleccionadas.length === 0 && terapias.length > 0) {
      const terapia = terapias.find(t => t.id === servicioParam);
      if (terapia) {
        setTerapiasSeleccionadas([terapia.id]);
        setPaso(2);
      }
    }
  }, [searchParams, terapiasSeleccionadas.length, terapias]);

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

    const totalServicios = serviciosSeleccionados.reduce((acc, id) => {
      const servicio = serviciosAdicionales.find(s => s.id === id);
      const precio = esAfiliado ? servicio?.precioAfiliado : servicio?.precioParticular;
      return acc + (precio || 0);
    }, 0);

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
    
    const reserva = {
      esAfiliado,
      afiliadoNombre: afiliadoNombre || null,
      terapias: terapiasSeleccionadas.map(id => {
        const terapia = terapias.find(t => t.id === id);
        return terapia;
      }),
      serviciosAdicionales: serviciosSeleccionados.map(id => {
        const servicio = serviciosAdicionales.find(s => s.id === id);
        const precio = esAfiliado ? servicio?.precioAfiliado : servicio?.precioParticular;
        return {
          ...servicio,
          precioAplicado: precio
        };
      }),
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
                {terapiasSeleccionadas.length > 0 && (
                  <div>
                    <p className="font-semibold text-[#3d2817] mb-1">Terapias seleccionadas:</p>
                    {terapiasSeleccionadas.map(id => {
                      const terapia = terapias.find(t => t.id === id);
                      return (
                        <p key={id} className="ml-4">• {terapia?.nombre} - ${terapia?.precio.toLocaleString('es-CO')}</p>
                      );
                    })}
                  </div>
                )}
                
                {serviciosSeleccionados.length > 0 && (
                  <div className="pt-2 border-t border-stone-300">
                    <p className="font-semibold text-[#3d2817] mb-1">Servicios adicionales:</p>
                    {serviciosSeleccionados.map(id => {
                      const servicio = serviciosAdicionales.find(s => s.id === id);
                      const precio = esAfiliado ? servicio?.precioAfiliado : servicio?.precioParticular;
                      return (
                        <p key={id} className="ml-4">
                          • {servicio?.nombre} - ${precio?.toLocaleString('es-CO')}
                          {esAfiliado && <span className="text-green-600 font-semibold ml-2">(Precio afiliado)</span>}
                        </p>
                      );
                    })}
                  </div>
                )}
                
                {productosSeleccionados.length > 0 && (
                  <div className="pt-2 border-t border-stone-300">
                    <p className="font-semibold text-[#3d2817] mb-1">Productos:</p>
                    {productosSeleccionados.map(id => {
                      const producto = productosSpa.find(p => p.id === id);
                      return (
                        <p key={id} className="ml-4">• {producto?.nombre} - ${producto?.precio.toLocaleString('es-CO')}</p>
                      );
                    })}
                  </div>
                )}
                
                <p className="pt-2"><strong>Duración total:</strong> {calcularDuracionTotal()} minutos</p>
                <p><strong>Método de pago:</strong> {
                  metodoPago === 'wompi' ? '💳 Tarjeta (Wompi)' :
                  metodoPago === 'nequi' ? '📱 Nequi' :
                  metodoPago === 'efectivo' ? '💵 Efectivo' : 'No especificado'
                }</p>
                <p className="pt-2 border-t border-stone-300 mt-2 text-lg"><strong>Total a pagar:</strong> ${calcularTotal().toLocaleString('es-CO')}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/573014185239?text=Hola, confirmo mi reserva para el ${fecha} a las ${horario}`}
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
                        setEsAfiliado(true);
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
              <h2 className="text-2xl md:text-3xl font-bold text-[#3d2817] text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                Selecciona tus Terapias
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {terapias.map(terapia => (
                  <button
                    key={terapia.id}
                    onClick={() => toggleTerapia(terapia.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      terapiasSeleccionadas.includes(terapia.id)
                        ? 'border-[#3d2817] bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg scale-105'
                        : 'border-stone-200 hover:border-amber-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-4xl">{terapia.icon}</span>
                      {terapiasSeleccionadas.includes(terapia.id) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <h3 className="font-bold text-[#3d2817] mb-2 text-sm leading-tight">{terapia.nombre}</h3>
                    <div className="flex items-center justify-between text-sm text-stone-600">
                      <span>{terapia.duracion} min</span>
                      <span className="font-bold text-[#3d2817]">${terapia.precio.toLocaleString('es-CO')}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="border-t-2 border-stone-200 pt-8">
                <h3 className="text-xl font-bold text-[#3d2817] mb-4">
                  Servicios Adicionales
                  {esAfiliado && <span className="text-green-600 text-sm ml-2">(Con descuento de afiliado)</span>}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {serviciosAdicionales.map(servicio => {
                    const precio = esAfiliado ? servicio.precioAfiliado : servicio.precioParticular;
                    const precioOriginal = servicio.precioParticular;
                    
                    return (
                      <button
                        key={servicio.id}
                        onClick={() => toggleServicio(servicio.id)}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                          serviciosSeleccionados.includes(servicio.id)
                            ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg scale-105'
                            : 'border-stone-200 hover:border-green-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-4xl">{servicio.icon}</span>
                          {serviciosSeleccionados.includes(servicio.id) && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <h3 className="font-bold text-[#3d2817] mb-2">{servicio.nombre}</h3>
                        <div className="text-sm">
                          {esAfiliado && (
                            <p className="text-stone-500 line-through">${precioOriginal.toLocaleString('es-CO')}</p>
                          )}
                          <p className="font-bold text-lg text-green-600">
                            ${precio.toLocaleString('es-CO')}
                          </p>
                          {esAfiliado && (
                            <p className="text-xs text-green-600 font-semibold mt-1">
                              ¡Ahorra ${(precioOriginal - precio).toLocaleString('es-CO')}!
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t-2 border-stone-200 pt-8">
                <h3 className="text-xl font-bold text-[#3d2817] mb-4">Productos Spa (Opcional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productosSpa.map(producto => (
                    <button
                      key={producto.id}
                      onClick={() => toggleProducto(producto.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
                        productosSeleccionados.includes(producto.id)
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-stone-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <span className="text-3xl">{producto.icon}</span>
                      <div className="flex-1 text-left">
                        <h4 className="font-semibold text-[#3d2817]">{producto.nombre}</h4>
                        <p className="text-sm font-bold text-blue-600">${producto.precio.toLocaleString('es-CO')}</p>
                      </div>
                      {productosSeleccionados.includes(producto.id) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-[#3d2817]">Total estimado:</span>
                  <span className="text-3xl font-bold text-[#3d2817]">${calcularTotal().toLocaleString('es-CO')}</span>
                </div>
                <p className="text-sm text-stone-600">Duración total: {calcularDuracionTotal()} minutos</p>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setPaso(1)}
                  className="px-8 py-3 rounded-full border-2 border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-all duration-300"
                >
                  ← Atrás
                </button>
                <button
                  onClick={() => {
                    if (terapiasSeleccionadas.length === 0) {
                      alert('Por favor selecciona al menos una terapia');
                      return;
                    }
                    setPaso(3);
                  }}
                  className="px-12 py-3 rounded-full bg-[#3d2817] text-white font-semibold hover:bg-[#2d1f11] transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {paso === 3 && (
            <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#3d2817] text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                Fecha y Horario
              </h2>

              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    Selecciona la fecha
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => {
                      const fechaSeleccionada = e.target.value;
                      if (esDiaValido(fechaSeleccionada)) {
                        setFecha(fechaSeleccionada);
                      } else {
                        alert('Lo sentimos, no abrimos los lunes, martes y miércoles. Por favor selecciona otro día.');
                        setFecha('');
                      }
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#3d2817] focus:outline-none transition-all duration-300"
                  />
                  <p className="text-xs text-stone-500 mt-1">
                    Cerrados los lunes, martes y miércoles
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    Selecciona el horario
                  </label>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {horariosDisponibles.map(hora => (
                      <button
                        key={hora}
                        onClick={() => setHorario(hora)}
                        disabled={!fecha}
                        className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                          horario === hora
                            ? 'bg-[#3d2817] text-white shadow-lg scale-105'
                            : fecha
                            ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                            : 'bg-stone-50 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        {hora}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-6">
                <button
                  onClick={() => setPaso(2)}
                  className="px-8 py-3 rounded-full border-2 border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-all duration-300"
                >
                  ← Atrás
                </button>
                <button
                  onClick={() => {
                    if (!fecha || !horario) {
                      alert('Por favor selecciona fecha y horario');
                      return;
                    }
                    setPaso(4);
                  }}
                  className="px-12 py-3 rounded-full bg-[#3d2817] text-white font-semibold hover:bg-[#2d1f11] transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {paso === 4 && (
            <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#3d2817] text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                Datos Personales y Pago
              </h2>

              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#3d2817] focus:outline-none transition-all duration-300"
                    placeholder="Tu nombre completo"
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#3d2817] focus:outline-none transition-all duration-300"
                    placeholder="3001234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#3d2817] focus:outline-none transition-all duration-300"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    Notas adicionales
                  </label>
                  <textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#3d2817] focus:outline-none transition-all duration-300"
                    placeholder="¿Alguna consideración especial?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    Método de pago *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setMetodoPago('wompi')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        metodoPago === 'wompi'
                          ? 'border-purple-500 bg-purple-50 shadow-lg'
                          : 'border-stone-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">💳</div>
                      <div className="font-semibold text-[#3d2817]">Tarjeta</div>
                      <div className="text-xs text-stone-600">Wompi</div>
                    </button>

                    <button
                      onClick={() => setMetodoPago('nequi')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        metodoPago === 'nequi'
                          ? 'border-purple-500 bg-purple-50 shadow-lg'
                          : 'border-stone-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">📱</div>
                      <div className="font-semibold text-[#3d2817]">Nequi</div>
                      <div className="text-xs text-stone-600">Transferencia</div>
                    </button>

                    <button
                      onClick={() => setMetodoPago('efectivo')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        metodoPago === 'efectivo'
                          ? 'border-green-500 bg-green-50 shadow-lg'
                          : 'border-stone-200 hover:border-green-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">💵</div>
                      <div className="font-semibold text-[#3d2817]">Efectivo</div>
                      <div className="text-xs text-stone-600">En el spa</div>
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
                  <h3 className="font-bold text-[#3d2817] mb-4 text-lg">Resumen de tu reserva</h3>
                  <div className="space-y-2 text-sm text-stone-700">
                    <div className="flex justify-between">
                      <span>Fecha:</span>
                      <span className="font-semibold">{fecha}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Horario:</span>
                      <span className="font-semibold">{horario}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Terapias:</span>
                      <span className="font-semibold">{terapiasSeleccionadas.length}</span>
                    </div>
                    {serviciosSeleccionados.length > 0 && (
                      <div className="flex justify-between">
                        <span>Servicios adicionales:</span>
                        <span className="font-semibold">{serviciosSeleccionados.length}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Duración total:</span>
                      <span className="font-semibold">{calcularDuracionTotal()} min</span>
                    </div>
                    <div className="border-t-2 border-amber-300 pt-2 mt-2">
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-[#3d2817]">${calcularTotal().toLocaleString('es-CO')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-6">
                <button
                  onClick={() => setPaso(3)}
                  className="px-8 py-3 rounded-full border-2 border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-all duration-300"
                >
                  ← Atrás
                </button>
                <button
                  onClick={() => {
                    if (!nombre || !telefono || !metodoPago) {
                      alert('Por favor completa todos los campos obligatorios');
                      return;
                    }
                    handleSubmit();
                  }}
                  disabled={submitting}
                  className="px-12 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Procesando...' : 'Confirmar Reserva ✓'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ReservasPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-100 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#3d2817] mx-auto mb-4"></div>
          <p className="text-lg text-stone-600 font-semibold">Cargando sistema de reservas...</p>
        </div>
      </main>
    }>
      <ReservasContent />
    </Suspense>
  );
}

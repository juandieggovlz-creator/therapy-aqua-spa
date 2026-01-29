"use client";

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { showNotification } from '@/app/components/NotificationSystem';

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
  precioAfiliado?: number;
  precioParticular?: number;
  precio: number;
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
  { id: 'brazos', nombre: 'THERAPY LESIONES MUSCULARES BRAZOS', duracion: 30, precio: 180000, icon: '💪' },
  { id: 'piernas', nombre: 'THERAPY LESIONES MUSCULARES PIERNAS', duracion: 30, precio: 180000, icon: '🦵' },
  { id: 'hombro', nombre: 'THERAPY TRAUMA HOMBRO, CODO, MUÑECA', duracion: 30, precio: 250000, icon: '🤝' },
  { id: 'cadera', nombre: 'THERAPY TRAUMA CADERA, RODILLA, TOBILLO', duracion: 30, precio: 250000, icon: '🦿' },
  { id: 'skincare-mano', nombre: 'SKINCARE MANO THERAPY', duracion: 30, precio: 90000, icon: '🤲' },
  { id: 'preso-ocular', nombre: 'PRESO THERAPY OCULAR', duracion: 30, precio: 80000, icon: '👁️' },
  { id: 'bienestar-general', nombre: 'MASAJE BIENESTAR GENERAL', duracion: 45, precio: 140000, icon: '🌿' },
  { id: 'cuello', nombre: 'MASAJE DE CUELLO', duracion: 30, precio: 90000, icon: '💆' },
  { id: 'facial', nombre: 'MASAJE FACIAL', duracion: 30, precio: 90000, icon: '✨' },
  { id: 'espalda', nombre: 'MASAJE DE ESPALDA', duracion: 30, precio: 120000, icon: '🧘' },
  { id: 'hombros', nombre: 'MASAJE HOMBROS Y BRAZOS', duracion: 30, precio: 100000, icon: '💆' },
  { id: 'rodillas', nombre: 'MASAJE CADERAS Y RODILLAS', duracion: 30, precio: 120000, icon: '🦴' },
  { id: 'pies', nombre: 'MASAJE PANTORRILLAS Y PIES', duracion: 30, precio: 120000, icon: '🦶' },
  { id: 'deportivo', nombre: 'MASAJE THERAPY DEPORTIVO', duracion: 40, precio: 100000, icon: '🏃' },
];

const serviciosAdicionales: ServicioAdicional[] = [
  { id: 'sauna', nombre: 'Sauna', precioAfiliado: 13000, precioParticular: 29900, precio: 29900, icon: '🔥' },
  { id: 'jacuzzi', nombre: 'Jacuzzi', precioAfiliado: 13000, precioParticular: 29900, precio: 29900, icon: '🛁' },
  { id: 'turco', nombre: 'Baño Turco', precioAfiliado: 13000, precioParticular: 29900, precio: 29900, icon: '💨' },
];

// Los productos se cargarán dinámicamente desde la API
const productosActualizadosPorDefecto: ProductoSpa[] = [
  { id: 'candado', nombre: 'Candado para casillero', precio: 5000, icon: '🔐' },
  { id: 'ropa', nombre: 'Kit ropa interior desechable', precio: 8000, icon: '👕' },
];

const horariosDisponibles = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
];

function ReservasContentInner() {
  const searchParams = useSearchParams();
  const [paso, setPaso] = useState(1);
  const [esAfiliado, setEsAfiliado] = useState(false);
  const [afiliadoNombre, setAfiliadoNombre] = useState<string | null>(null);
  const [showAfiliadoInfo, setShowAfiliadoInfo] = useState(true);
  
  // Verificar autenticación de afiliado al cargar
  useEffect(() => {
    const checkAfiliado = () => {
      const afiliadoToken = sessionStorage.getItem('afiliado_token');
      const afiliadoData = sessionStorage.getItem('afiliado');
      
      if (afiliadoToken && afiliadoData) {
        try {
          const afiliado = JSON.parse(afiliadoData);
          setEsAfiliado(true);
          setAfiliadoNombre(afiliado.nombre);
          if (afiliado.nombre) setNombre(afiliado.nombre);
          if (afiliado.telefono) setTelefono(afiliado.telefono);
          if (afiliado.email) setEmail(afiliado.email);
        } catch (e) {
          console.error('Error parsing afiliado data:', e);
          setEsAfiliado(false);
          setAfiliadoNombre(null);
        }
      } else {
        setEsAfiliado(false);
        setAfiliadoNombre(null);
      }
    };
    
    checkAfiliado();
  }, []);
  const [terapiasSeleccionadas, setTerapiasSeleccionadas] = useState<string[]>([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<string[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<string[]>([]);
  const [fecha, setFecha] = useState('');
  const [horario, setHorario] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [mensajeErrorFecha, setMensajeErrorFecha] = useState('');
  const [mensajeErrorHorario, setMensajeErrorHorario] = useState('');
  const [errorTelefono, setErrorTelefono] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [notas, setNotas] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reservaExitosa, setReservaExitosa] = useState(false);
  const [promocion, setPromocion] = useState<any>(null);
  const [descuentosServicios, setDescuentosServicios] = useState<Record<string, number>>({});
  const [terapiasActualizadas, setTerapiasActualizadas] = useState<TerapiaItem[]>(terapias);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [reservasExistentes, setReservasExistentes] = useState<any[]>([]);
  const [mostrarSoloDisponibles, setMostrarSoloDisponibles] = useState(false);
  const [productosActualizados, setProductosActualizados] = useState<ProductoSpa[]>(productosActualizadosPorDefecto);

  const diasCerrados = [1, 2, 3]; // Lunes, Martes, Miércoles
  const [servicioPrecargado, setServicioPrecargado] = useState(false);

  // Función para cargar servicios y descuentos desde la API
  const cargarServicios = useCallback(async () => {
    try {
      console.log('📥 Cargando servicios y descuentos desde API...');
      setLoadingServicios(true);
      
      const timestamp = new Date().getTime();
      
      // Cargar servicios
      const responseServicios = await fetch(`/api/admin/servicios?cache=${timestamp}`, {
        cache: 'no-store'
      });
      
      if (!responseServicios.ok) {
        console.warn('⚠️ No se pudieron cargar servicios desde la API, usando valores por defecto');
        setTerapiasActualizadas(terapias);
        setLoadingServicios(false);
        return;
      }
      
      const dataServicios = await responseServicios.json();
      const serviciosAPI = dataServicios.servicios || [];
      
      // Cargar descuentos
      try {
        const responseDescuentos = await fetch(`/api/admin/descuentos?cache=${timestamp}`, {
          cache: 'no-store'
        });
        
        if (responseDescuentos.ok) {
          const dataDescuentos = await responseDescuentos.json();
          const descuentos = dataDescuentos.descuentos || {};
          console.log('✅ Descuentos cargados:', descuentos);
          setDescuentosServicios(descuentos);
        } else {
          console.warn('⚠️ No se pudieron cargar descuentos, usando valores vacíos');
          setDescuentosServicios({});
        }
      } catch (errorDescuentos) {
        console.error('❌ Error cargando descuentos:', errorDescuentos);
        setDescuentosServicios({});
      }
      
        // Filtrar solo servicios activos y mapearlos al formato de TerapiaItem
        // Asegurar que todos los campos necesarios estén presentes y validados
        const serviciosActivos = serviciosAPI
          .filter((s: any) => {
            // IMPORTANTE: Solo mostrar servicios con activo === true
            if (s.activo !== true) return false;
            if (!s.id || !s.nombre) {
              console.warn(`⚠️ Servicio inválido encontrado (sin ID o nombre):`, s);
              return false;
            }
            return true;
          })
          .map((s: any) => {
            // Validar y normalizar cada servicio con valores por defecto seguros
            return {
              id: s.id,
              nombre: s.nombre || 'Servicio sin nombre',
              duracion: (s.duracion && s.duracion > 0) ? s.duracion : 30,
              precio: (s.precio && s.precio >= 0) ? s.precio : 0,
              // precioOriginal ya no se usa, precio es la fuente de verdad
              icon: s.icon || '✨'
            };
          })
          .sort((a: TerapiaItem, b: TerapiaItem) => {
            // Mantener el orden original si hay un campo orden, sino por nombre
            const servicioA = serviciosAPI.find((s: any) => s.id === a.id);
            const servicioB = serviciosAPI.find((s: any) => s.id === b.id);
            const ordenA = servicioA?.orden || 999;
            const ordenB = servicioB?.orden || 999;
            return ordenA - ordenB;
          });
      
      if (serviciosActivos.length > 0) {
        console.log(`✅ Servicios cargados desde API: ${serviciosActivos.length} servicios activos`);
        console.log('📊 Muestra de precios cargados:', serviciosActivos.slice(0, 3).map((s: TerapiaItem) => ({ id: s.id, nombre: s.nombre, precio: s.precio, duracion: s.duracion })));
        setTerapiasActualizadas(serviciosActivos);
      } else {
        console.warn('⚠️ No hay servicios activos en la API, usando valores por defecto');
        setTerapiasActualizadas(terapias);
      }
      
      // Cargar productos adicionales
      try {
        const responseProductos = await fetch(`/api/admin/productos?cache=${timestamp}`, {
          cache: 'no-store'
        });
        
        if (responseProductos.ok) {
          const dataProductos = await responseProductos.json();
          const productosAPI = (dataProductos.productos || [])
            .filter((p: any) => p.activo === true)
            .map((p: any) => ({
              id: p.id,
              nombre: p.nombre,
              precio: p.precio,
              icon: p.icon || '📦'
            }));
          
          if (productosAPI.length > 0) {
            console.log(`✅ Productos cargados desde API: ${productosAPI.length} productos activos`);
            setProductosActualizados(productosAPI);
          } else {
            console.warn('⚠️ No hay productos activos en la API, usando valores por defecto');
            setProductosActualizados(productosActualizadosPorDefecto);
          }
        } else {
          console.warn('⚠️ No se pudieron cargar productos, usando valores por defecto');
          setProductosActualizados(productosActualizadosPorDefecto);
        }
      } catch (errorProductos) {
        console.error('❌ Error cargando productos:', errorProductos);
        setProductosActualizados(productosActualizadosPorDefecto);
      }
    } catch (error) {
      console.error('❌ Error cargando servicios desde API:', error);
      // En caso de error, usar los valores por defecto
      setTerapiasActualizadas(terapias);
      setDescuentosServicios({});
      setProductosActualizados(productosActualizadosPorDefecto);
    } finally {
      setLoadingServicios(false);
    }
  }, []);

  // Cargar servicios desde la API al montar el componente
  useEffect(() => {
    cargarServicios();
    
    // Verificar si hay cambios pendientes en localStorage
    const necesitaRecarga = localStorage.getItem('necesita_recarga');
    if (necesitaRecarga === 'true') {
      console.log('🔔 Página Reservas detectó cambios pendientes en localStorage');
      console.log('🔄 Recargando servicios automáticamente...');
      setTimeout(() => cargarServicios(), 100);
      setTimeout(() => cargarServicios(), 500);
      setTimeout(() => cargarServicios(), 1000);
    }
  }, [cargarServicios]);

  // Escuchar eventos de actualización de servicios desde el panel admin
  useEffect(() => {
    const handleServicioActualizado = (event: any) => {
      console.log('📋 Reservas - ⚡ EVENTO CAPTURADO: servicioActualizado', event?.detail);
      console.log('🔄 Recargando servicios en reservas AHORA...');
      cargarServicios();
      setTimeout(() => cargarServicios(), 100);
      setTimeout(() => cargarServicios(), 300);
      setTimeout(() => cargarServicios(), 600);
    };

    const handleDescuentoActualizado = (event: any) => {
      console.log('📋 Reservas - ⚡ EVENTO CAPTURADO: descuentoActualizado', event?.detail);
      console.log('🔄 Recargando servicios en reservas AHORA...');
      cargarServicios();
      setTimeout(() => cargarServicios(), 100);
      setTimeout(() => cargarServicios(), 300);
      setTimeout(() => cargarServicios(), 600);
    };

    const handleActualizarPaginaPrincipal = (event: any) => {
      console.log('📋 Reservas - ⚡⚡⚡ EVENTO GLOBAL CAPTURADO: actualizarPaginaPrincipal ⚡⚡⚡', event?.detail);
      console.log('🔄🔄🔄 RECARGA COMPLETA DE RESERVAS INICIADA 🔄🔄🔄');
      cargarServicios();
      setTimeout(() => cargarServicios(), 100);
      setTimeout(() => cargarServicios(), 300);
      setTimeout(() => cargarServicios(), 600);
      setTimeout(() => cargarServicios(), 1000);
      setTimeout(() => {
        console.log('✅ Página Reservas - Recarga completa finalizada');
      }, 1100);
    };

    const handleProductoActualizado = (event: any) => {
      console.log('📋 Reservas - ⚡ EVENTO CAPTURADO: productoActualizado', event?.detail);
      console.log('🔄 Recargando productos en reservas AHORA...');
      cargarServicios();
      setTimeout(() => cargarServicios(), 100);
      setTimeout(() => cargarServicios(), 300);
      setTimeout(() => cargarServicios(), 600);
    };

    window.addEventListener('servicioActualizado', handleServicioActualizado, true);
    window.addEventListener('descuentoActualizado', handleDescuentoActualizado, true);
    window.addEventListener('productoActualizado', handleProductoActualizado, true);
    window.addEventListener('actualizarPaginaPrincipal', handleActualizarPaginaPrincipal, true);

    return () => {
      window.removeEventListener('servicioActualizado', handleServicioActualizado, true);
      window.removeEventListener('descuentoActualizado', handleDescuentoActualizado, true);
      window.removeEventListener('productoActualizado', handleProductoActualizado, true);
      window.removeEventListener('actualizarPaginaPrincipal', handleActualizarPaginaPrincipal, true);
    };
  }, [cargarServicios]);

  // Función para validar si un día es válido (no está cerrado)
  const esDiaValido = (fecha: string) => {
    if (!fecha) return true;
    const dia = new Date(fecha + 'T00:00:00').getDay();
    return !diasCerrados.includes(dia);
  };

  // Validar teléfono colombiano (10 dígitos, comienza con 3)
  const validarTelefono = (tel: string): boolean => {
    const soloNumeros = tel.replace(/\D/g, '');
    return soloNumeros.length === 10 && soloNumeros.startsWith('3');
  };

  // Validar email
  const validarEmail = (email: string): boolean => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  };

  // Manejar cambio de teléfono con validación en tiempo real
  const handleTelefonoChange = (valor: string) => {
    // Solo permitir números
    const soloNumeros = valor.replace(/\D/g, '');
    setTelefono(soloNumeros);
    
    if (soloNumeros.length === 0) {
      setErrorTelefono('');
    } else if (soloNumeros.length < 10) {
      setErrorTelefono('El teléfono debe tener 10 dígitos');
    } else if (soloNumeros.length === 10 && !soloNumeros.startsWith('3')) {
      setErrorTelefono('El número debe comenzar con 3 (teléfono móvil)');
    } else if (soloNumeros.length > 10) {
      setErrorTelefono('El teléfono no puede tener más de 10 dígitos');
    } else {
      setErrorTelefono('');
    }
  };

  // Manejar cambio de email con validación en tiempo real
  const handleEmailChange = (valor: string) => {
    setEmail(valor);
    
    if (valor.length === 0) {
      setErrorEmail('');
    } else if (!validarEmail(valor)) {
      setErrorEmail('Ingresa un email válido (ejemplo: usuario@correo.com)');
    } else {
      setErrorEmail('');
    }
  };

  // Función para obtener las fechas disponibles (excluyendo días cerrados)
  const obtenerFechasDisponibles = () => {
    const fechas: string[] = [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    // Generar fechas para los próximos 60 días
    for (let i = 0; i < 60; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      const diaSemana = fecha.getDay();
      
      // Solo incluir días que no estén cerrados (no lunes, martes, miércoles)
      if (!diasCerrados.includes(diaSemana)) {
        fechas.push(fecha.toISOString().split('T')[0]);
      }
    }
    return fechas;
  };

  // Función para verificar si un horario está ocupado
  const verificarHorarioOcupado = (fechaSeleccionada: string, horario: string) => {
    const fechaNormalizada = fechaSeleccionada.split('T')[0];
    
    return reservasExistentes.some((reserva: any) => {
      // Solo considerar reservas activas
      if (reserva.estado !== 'pendiente' && reserva.estado !== 'pendiente de pago' && reserva.estado !== 'confirmada') {
        return false;
      }
      
      // Normalizar fecha de la reserva
      const fechaReserva = reserva.fecha ? reserva.fecha.split('T')[0] : null;
      
      // Comparar fecha y horario
      if (fechaReserva !== fechaNormalizada) {
        return false;
      }
      
      const horarioReserva = reserva.hora || reserva.horario || '';
      return horarioReserva === horario;
    });
  };

  // Función para obtener horarios disponibles según el día seleccionado
  const obtenerHorariosDisponibles = (fechaSeleccionada: string) => {
    if (!fechaSeleccionada || !esDiaValido(fechaSeleccionada)) {
      return [];
    }
    
    // Filtrar horarios que ya pasaron (con margen de 1 hora)
    const ahora = new Date();
    const margenTiempo = 60 * 60 * 1000; // 60 minutos (1 hora) en milisegundos
    const ahoraConMargen = new Date(ahora.getTime() + margenTiempo);
    
    return horariosDisponibles.filter(horario => {
      const fechaHora = new Date(fechaSeleccionada + 'T' + horario + ':00');
      
      // Verificar si ya pasó el horario
      if (fechaHora < ahoraConMargen) {
        return false;
      }
      
      // Si el filtro está activo, excluir horarios ocupados
      if (mostrarSoloDisponibles) {
        const estaOcupado = verificarHorarioOcupado(fechaSeleccionada, horario);
        return !estaOcupado;
      }
      
      // Si el filtro está desactivado, mostrar todos los horarios (incluso ocupados)
      return true;
    });
  };

  const fechasDisponibles = obtenerFechasDisponibles();
  const horariosDisponiblesParaFecha = obtenerHorariosDisponibles(fecha);

  // Cargar promoción activa
  useEffect(() => {
    const loadPromocion = async () => {
      try {
        const timestamp = new Date().getTime();
        const promocionRes = await fetch(`/api/admin/promociones?cache=${timestamp}`, {
          cache: 'no-store'
        });
        const promocionData = await promocionRes.json();
        
        if (promocionData.promocion) {
          console.log('🎁 Promoción activa cargada:', promocionData.promocion);
          console.log(`  📋 Tipo: ${promocionData.promocion.tipo} (${promocionData.promocion.valor}${promocionData.promocion.tipo === 'porcentaje' ? '%' : ' COP'})`);
          console.log(`  🎯 Aplicación: ${promocionData.promocion.tipoAplicacion}`);
        } else {
          console.log('ℹ️ No hay promociones activas');
        }
        
        setPromocion(promocionData.promocion);
      } catch (error) {
        console.error('❌ Error cargando promoción:', error);
        setPromocion(null);
      }
    };
    loadPromocion();
  }, []);

  // Cargar reservas existentes cuando cambia la fecha
  useEffect(() => {
    const loadReservas = async () => {
      if (!fecha) {
        setReservasExistentes([]);
        return;
      }
      
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/bookings?cache=${timestamp}`, {
          cache: 'no-store'
        });
        const data = await response.json();
        const reservas = data.bookings || [];
        
        console.log(`📅 Reservas cargadas para filtrar horarios: ${reservas.length}`);
        
        // Filtrar solo reservas activas de la fecha seleccionada
        const fechaNormalizada = fecha.split('T')[0];
        const reservasActivas = reservas.filter((r: any) => {
          const estadoActivo = r.estado === 'pendiente' || r.estado === 'pendiente de pago' || r.estado === 'confirmada';
          const fechaReserva = r.fecha ? r.fecha.split('T')[0] : null;
          return estadoActivo && fechaReserva === fechaNormalizada;
        });
        
        console.log(`🔒 Horarios ocupados en ${fechaNormalizada}:`, reservasActivas.map((r: any) => `${r.hora || r.horario} [${r.estado}]`));
        
        setReservasExistentes(reservas);
      } catch (error) {
        console.error('❌ Error cargando reservas:', error);
        setReservasExistentes([]);
      }
    };
    
    loadReservas();
  }, [fecha]);

  useEffect(() => {
    const servicioParam = searchParams?.get('servicio');
    if (servicioParam && !servicioPrecargado && terapiasSeleccionadas.length === 0) {
      const terapia = terapiasActualizadas.find(t => t.id === servicioParam);
      if (terapia) {
        setTerapiasSeleccionadas([terapia.id]);
        setPaso(1);
        setServicioPrecargado(true);
      }
    }
  }, [searchParams, servicioPrecargado, terapiasActualizadas]);

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
    // 1️⃣ CALCULAR PRECIOS ORIGINALES (sin ningún descuento)
    const totalTerapiasOriginal = terapiasSeleccionadas.reduce((acc, id) => {
      const terapia = terapiasActualizadas.find(t => t.id === id);
      return acc + (terapia?.precio || 0);
    }, 0);

    const totalServiciosOriginal = serviciosSeleccionados.reduce((acc, id) => {
      const servicio = serviciosAdicionales.find(s => s.id === id);
      if (!servicio) return acc;
      // Usar precio de afiliado si es afiliado, sino usar precio particular
      const precio = esAfiliado ? (servicio.precioAfiliado || servicio.precio) : (servicio.precioParticular || servicio.precio);
      return acc + precio;
    }, 0);

    const totalProductosOriginal = productosSeleccionados.reduce((acc, id) => {
      const producto = productosActualizados.find(p => p.id === id);
      return acc + (producto?.precio || 0);
    }, 0);

    const subtotalOriginal = totalTerapiasOriginal + totalServiciosOriginal + totalProductosOriginal;

    // 2️⃣ APLICAR DESCUENTOS INDIVIDUALES DE SERVICIOS
    let totalDescuentosIndividuales = 0;
    const totalTerapiasConDescuento = terapiasSeleccionadas.reduce((acc, id) => {
      const terapia = terapiasActualizadas.find(t => t.id === id);
      if (!terapia) return acc;
      
      const precioBase = terapia.precio;
      let precioFinal = precioBase;
      
      if (descuentosServicios[id]) {
        const descuento = precioBase * (descuentosServicios[id] / 100);
        totalDescuentosIndividuales += descuento;
        precioFinal = precioBase - descuento;
      }
      
      return acc + precioFinal;
    }, 0);

    const subtotalConDescuentosIndividuales = totalTerapiasConDescuento + totalServiciosOriginal + totalProductosOriginal;

    // 3️⃣ APLICAR DESCUENTO DE AFILIADO (20% sobre el SUBTOTAL COMPLETO)
    let descuentoAfiliado = 0;
    let subtotalConDescuentoAfiliado = subtotalConDescuentosIndividuales;
    
    if (esAfiliado) {
      // Aplicar 20% sobre TODO el subtotal (terapias + servicios adicionales + productos)
      descuentoAfiliado = subtotalConDescuentosIndividuales * 0.20;
      subtotalConDescuentoAfiliado = subtotalConDescuentosIndividuales - descuentoAfiliado;
    }

    // 4️⃣ APLICAR PROMOCIÓN GLOBAL
    let descuentoPromocion = 0;
    let tienePromocion = false;
    let totalFinal = subtotalConDescuentoAfiliado;

    if (promocion && promocion.activa) {
      if (promocion.tipoAplicacion === 'todos') {
        tienePromocion = true;
        
        if (promocion.tipo === 'porcentaje') {
          descuentoPromocion = subtotalConDescuentoAfiliado * (promocion.valor / 100);
          totalFinal = subtotalConDescuentoAfiliado - descuentoPromocion;
        } else if (promocion.tipo === 'monto_fijo') {
          descuentoPromocion = promocion.valor;
          totalFinal = Math.max(0, subtotalConDescuentoAfiliado - descuentoPromocion);
        }
      } else if (promocion.tipoAplicacion === 'servicios_especificos' && promocion.serviciosIds) {
        const serviciosConPromocion = terapiasSeleccionadas.filter(id => promocion.serviciosIds?.includes(id));
        
        if (serviciosConPromocion.length > 0) {
          tienePromocion = true;
          
          const totalServiciosPromocion = serviciosConPromocion.reduce((acc, id) => {
            const terapia = terapiasActualizadas.find(t => t.id === id);
            if (!terapia) return acc;
            let precio = terapia.precio;
            if (descuentosServicios[id]) {
              precio = precio * (1 - descuentosServicios[id] / 100);
            }
            if (esAfiliado) {
              precio = precio * 0.8;
            }
            return acc + precio;
          }, 0);
          
          if (promocion.tipo === 'porcentaje') {
            descuentoPromocion = totalServiciosPromocion * (promocion.valor / 100);
            totalFinal = subtotalConDescuentoAfiliado - descuentoPromocion;
          }
        }
      } else if (promocion.tipoAplicacion === 'monto_minimo') {
        if (subtotalConDescuentoAfiliado >= (promocion.montoMinimo || 0)) {
          tienePromocion = true;
          
          if (promocion.tipo === 'porcentaje') {
            descuentoPromocion = subtotalConDescuentoAfiliado * (promocion.valor / 100);
            totalFinal = subtotalConDescuentoAfiliado - descuentoPromocion;
          } else if (promocion.tipo === 'monto_fijo') {
            descuentoPromocion = promocion.valor;
            totalFinal = Math.max(0, subtotalConDescuentoAfiliado - descuentoPromocion);
          }
        }
      }
    }
    
    // RETORNAR TODOS LOS VALORES PARA UN DESGLOSE CLARO
    return {
      // Totales originales
      subtotalOriginal: Math.round(subtotalOriginal),
      totalTerapiasOriginal: Math.round(totalTerapiasOriginal),
      totalServiciosOriginal: Math.round(totalServiciosOriginal),
      totalProductosOriginal: Math.round(totalProductosOriginal),
      
      // Descuentos aplicados
      descuentosIndividuales: Math.round(totalDescuentosIndividuales),
      descuentoAfiliado: Math.round(descuentoAfiliado),
      descuentoPromocion: Math.round(descuentoPromocion),
      
      // Subtotales intermedios
      subtotalConDescuentosIndividuales: Math.round(subtotalConDescuentosIndividuales),
      subtotalConDescuentoAfiliado: Math.round(subtotalConDescuentoAfiliado),
      
      // Total final
      total: Math.round(totalFinal),
      
      // Información adicional
      tienePromocion: tienePromocion,
      promocionActiva: tienePromocion ? promocion : null,
      esAfiliado: esAfiliado,
      
      // Para compatibilidad con código existente
      totalOriginal: Math.round(subtotalOriginal),
      totalConPromocion: Math.round(totalFinal)
    };
  };

  const calcularDuracionTotal = () => {
    return terapiasSeleccionadas.reduce((acc, id) => {
      const terapia = terapiasActualizadas.find(t => t.id === id);
      return acc + (terapia?.duracion || 0);
    }, 0);
  };

  // Función para construir el mensaje de Telegram
  const construirMensajeTelegram = () => {
    // Construir lista de servicios seleccionados
    let listaServicios = '';
    
    // Agregar terapias
    if (terapiasSeleccionadas.length > 0) {
      const terapiasNombres = terapiasSeleccionadas.map(id => {
        const terapia = terapiasActualizadas.find(t => t.id === id);
        return terapia ? `• ${terapia.nombre}` : '';
      }).filter(Boolean);
      listaServicios += terapiasNombres.join('\n');
    }
    
    // Agregar servicios adicionales individuales
    if (serviciosSeleccionados.length > 0) {
      if (listaServicios) listaServicios += '\n';
      serviciosSeleccionados.forEach(id => {
        const servicio = serviciosAdicionales.find(s => s.id === id);
        if (servicio) {
          const precio = esAfiliado ? servicio.precioAfiliado : servicio.precioParticular;
          listaServicios += `• ${servicio.nombre} - $${precio?.toLocaleString('es-CO')}\n`;
        }
      });
    }
    
    // Agregar productos
    if (productosSeleccionados.length > 0) {
      if (listaServicios) listaServicios += '\n';
      productosSeleccionados.forEach(id => {
        const producto = productosActualizados.find(p => p.id === id);
        if (producto) {
          listaServicios += `• ${producto.nombre}\n`;
        }
      });
    }
    
    if (!listaServicios) {
      listaServicios = '• No se especificaron servicios';
    }
    
    // Formatear fecha (agregar T00:00:00 para evitar problemas de zona horaria)
    const fechaFormateada = fecha ? new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'No especificada';
    
    // Formatear total
    const totalCalculado = calcularTotal().total;
    const totalFormateado = `$${totalCalculado.toLocaleString('es-CO')}`;
    
    // Construir mensaje completo
    const mensaje = `¡Solicitud Enviada! 🎉
Nueva reserva recibida en Therapy Aqua Spa

Resumen de reserva:
👤 Nombre: ${nombre || 'No especificado'}
📞 Teléfono: ${telefono || 'No especificado'}
📧 Email: ${email || 'No especificado'}

📅 Fecha: ${fechaFormateada}
⏰ Hora: ${horario || 'No especificada'}

Servicios seleccionados:
${listaServicios}

⏱️ Duración total: ${calcularDuracionTotal()} minutos
💰 Total a pagar: ${totalFormateado}`;

    return mensaje;
  };

  // Función para enviar notificación a Telegram
  const enviarNotificacionTelegram = async (mensaje: string) => {
    try {
      const telegramUrl = 'https://api.telegram.org/bot8503447166:AAHQ9Q0DduvHIKTkef-WiGDwQ5NISJl0Uyc/sendMessage';
      
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: '5734885656',
          text: mensaje
        })
      });

      const data = await response.json();
      
      if (response.ok && data.ok) {
        showNotification.success('Reserva enviada correctamente');
        return true;
      } else {
        console.error('Error en respuesta de Telegram:', data);
        showNotification.warning('No se pudo enviar la notificación, pero la reserva fue creada');
        return false;
      }
    } catch (error) {
      console.error('Error enviando notificación a Telegram:', error);
      showNotification.warning('No se pudo enviar la notificación, pero la reserva fue creada');
      return false;
    }
  };

  const handleSubmit = async () => {
    // Limpiar mensajes de error previos
    setMensajeErrorHorario('');
    setMensajeErrorFecha('');
    setSubmitting(true);
    
    // Validar que hay servicios seleccionados
    if (terapiasSeleccionadas.length === 0) {
      setMensajeErrorHorario('Por favor selecciona al menos una terapia');
      setSubmitting(false);
      setTimeout(() => setMensajeErrorHorario(''), 5000);
      return;
    }

    // Validar fecha y horario
    if (!fecha || !horario) {
      setMensajeErrorHorario('Por favor selecciona fecha y horario');
      setSubmitting(false);
      setTimeout(() => setMensajeErrorHorario(''), 5000);
      return;
    }

    // Validar que la fecha y hora no sean en el pasado (con margen de 30 minutos)
    const [horas, minutos] = horario.split(':').map(Number);
    // Construir fecha con formato correcto para evitar problemas de zona horaria
    const fechaHoraReserva = new Date(fecha + 'T' + horario + ':00');
    const ahora = new Date();
    // Agregar margen de 1 hora para procesamiento
    const margenTiempo = 60 * 60 * 1000; // 60 minutos (1 hora) en milisegundos
    const ahoraConMargen = new Date(ahora.getTime() + margenTiempo);
    
    if (fechaHoraReserva < ahoraConMargen) {
      setMensajeErrorHorario('⚠️ Este horario ya no está disponible. Por favor selecciona un horario futuro (al menos 1 hora de anticipación).');
      setSubmitting(false);
      setTimeout(() => setMensajeErrorHorario(''), 7000);
      return;
    }

    // Verificar si hay un choque de horarios (misma fecha y misma hora)
    // Solo las reservas en estado "pendiente", "pendiente de pago", "confirmada" o "completada" bloquean un horario
    // Las reservas "canceladas" liberan la hora automáticamente
    try {
      const checkResponse = await fetch('/api/bookings');
      const checkData = await checkResponse.json();
      const reservasExistentes = checkData.bookings || [];
      
      // Buscar reservas con la misma fecha y hora que estén en estados que bloquean
      const reservaConflictiva = reservasExistentes.find((r: any) => {
        // Solo bloquear si está pendiente, pendiente de pago, confirmada o completada
        if (r.estado !== 'pendiente' && r.estado !== 'pendiente de pago' && r.estado !== 'confirmada' && r.estado !== 'completada') {
          return false;
        }
        
        // Comparar fechas (solo la fecha, no la hora)
        const fechaExistente = r.fecha ? new Date(r.fecha).toISOString().split('T')[0] : null;
        const fechaNueva = fecha ? new Date(fecha).toISOString().split('T')[0] : null;
        
        if (fechaExistente !== fechaNueva) return false;
        
        // Comparar horas (exactamente la misma hora)
        const horaExistente = r.hora || r.horario || '';
        const horaNueva = horario || '';
        
        return horaExistente === horaNueva;
      });

      if (reservaConflictiva) {
        setMensajeErrorHorario('Este horario ya está ocupado. Por favor selecciona otra hora.');
        setSubmitting(false);
        // Limpiar el mensaje después de 7 segundos
        setTimeout(() => setMensajeErrorHorario(''), 7000);
        return;
      }
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      setMensajeErrorHorario('Error al verificar disponibilidad. Intenta nuevamente.');
      setSubmitting(false);
      setTimeout(() => setMensajeErrorHorario(''), 5000);
      return;
    }
    
    // Validar que todas las terapias seleccionadas existan y tengan los campos necesarios
    const terapiasValidadas = terapiasSeleccionadas
      .map(id => {
        const terapia = terapiasActualizadas.find(t => t.id === id);
        if (!terapia) {
          console.warn(`⚠️ Terapia con ID "${id}" no encontrada en terapiasActualizadas`);
          return null;
        }
        // Asegurar que tenga todos los campos necesarios
        return {
          id: terapia.id,
          nombre: terapia.nombre || 'Servicio sin nombre',
          precio: terapia.precio || 0,
          duracion: terapia.duracion || 30,
          icon: terapia.icon || '✨',
          servicioId: terapia.id // Para compatibilidad
        };
      })
      .filter(Boolean);

    if (terapiasValidadas.length === 0) {
      setMensajeErrorHorario('Error: No se pudieron validar las terapias seleccionadas. Por favor recarga la página.');
      setSubmitting(false);
      setTimeout(() => setMensajeErrorHorario(''), 7000);
      return;
    }

    // Validar datos personales
    if (!nombre.trim()) {
      setMensajeErrorHorario('Por favor ingresa tu nombre completo');
      setSubmitting(false);
      setTimeout(() => setMensajeErrorHorario(''), 5000);
      return;
    }

    if (!validarTelefono(telefono)) {
      setMensajeErrorHorario('Por favor ingresa un número de teléfono válido (10 dígitos, comienza con 3)');
      setSubmitting(false);
      setTimeout(() => setMensajeErrorHorario(''), 5000);
      return;
    }

    if (!validarEmail(email)) {
      setMensajeErrorHorario('Por favor ingresa un email válido');
      setSubmitting(false);
      setTimeout(() => setMensajeErrorHorario(''), 5000);
      return;
    }

    const reserva = {
      esAfiliado,
      afiliadoNombre: afiliadoNombre || null,
      terapias: terapiasValidadas,
      serviciosAdicionales: serviciosSeleccionados.map(id => {
        const servicio = serviciosAdicionales.find(s => s.id === id);
        if (!servicio) return null;
        const precio = esAfiliado ? servicio.precioAfiliado : servicio.precioParticular;
        return {
          ...servicio,
          precioAplicado: precio
        };
      }).filter(Boolean),
      productos: productosSeleccionados.map(id => productosActualizados.find(p => p.id === id)).filter(Boolean),
      fecha,
      horario,
      duracionTotal: calcularDuracionTotal(),
      nombre,
      telefono,
      email,
      notas,
      total: calcularTotal().total,
      fechaCreacion: new Date().toISOString()
    };

    try {
      // Guardar la reserva
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reserva),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Reserva creada exitosamente:', data);
        console.log('   Datos del cliente:', {
          nombre: nombre,
          telefono: telefono,
          email: email
        });
        console.log('   Cliente en respuesta:', data.cliente);
        
        // Enviar notificación a Telegram
        try {
          const mensajeTelegram = construirMensajeTelegram();
          console.log('📱 Enviando notificación a Telegram...');
          await enviarNotificacionTelegram(mensajeTelegram);
        } catch (error) {
          console.error('Error al enviar notificación a Telegram:', error);
          // No bloquear el flujo si falla la notificación
        }
        
        // Disparar evento para actualizar el dashboard, clientes y finanzas inmediatamente
        const evento = new CustomEvent('reservaCreada', { 
          detail: { 
            reserva: data.booking || data,
            cliente: data.cliente,
            nombre: nombre,
            telefono: telefono,
            email: email
          } 
        });
        window.dispatchEvent(evento);
        console.log('📢 Evento reservaCreada disparado con detalles:', evento.detail);
        
        setSubmitting(false);
        setReservaExitosa(true);
        setMensajeErrorHorario(''); // Limpiar cualquier error previo
        
        // Cambiar la URL sin recargar la página (remover localhost de la vista)
        const nuevaUrl = '/reservas?reserva=confirmada';
        if (typeof window !== 'undefined') {
          window.history.pushState({ path: nuevaUrl }, '', nuevaUrl);
        }
      } else {
        // Si hay error de conflicto (409), mostrar mensaje específico
        if (response.status === 409) {
          setMensajeErrorHorario(data.error || 'Este horario ya está ocupado. Por favor selecciona otra hora.');
        } else {
          setMensajeErrorHorario(data.error || 'Error al procesar la reserva. Intenta nuevamente.');
        }
        setSubmitting(false);
        setTimeout(() => setMensajeErrorHorario(''), 7000);
      }
    } catch (error) {
      console.error('Error:', error);
      setMensajeErrorHorario('Error de conexión. Intenta nuevamente.');
      setSubmitting(false);
      setTimeout(() => setMensajeErrorHorario(''), 5000);
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
            
            <div className="mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-[#3d2817] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                ¡Reserva Confirmada! ✨
              </h2>
              <p className="text-xl text-stone-700 font-semibold">
                Gracias por confiar en nosotros, <span className="text-amber-600">{nombre || 'Cliente'}</span>
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-2xl p-6 mb-6">
              <p className="text-lg text-green-800 font-semibold mb-2">
                🎉 ¡Tu reserva ha sido registrada exitosamente!
              </p>
              <p className="text-green-700">
                Te esperamos el <strong className="text-[#3d2817]">{fecha ? new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'día seleccionado'}</strong> a las <strong className="text-[#3d2817]">{horario}</strong>
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="text-3xl">📱</div>
                <div>
                  <p className="text-blue-900 font-bold text-lg mb-2">
                    Próximos pasos:
                  </p>
                  <ul className="text-blue-800 space-y-2 text-left">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">1.</span>
                      <span>Recibirás una confirmación por WhatsApp o llamada telefónica en las próximas horas.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">2.</span>
                      <span>Coordinararemos el método de pago y cualquier detalle adicional.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">3.</span>
                      <span>¡Prepárate para una experiencia única de bienestar y relajación!</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-[#3d2817] mb-4">Resumen de tu reserva:</h3>
              
              {/* Datos de contacto */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-[#3d2817] mb-2 text-sm uppercase">Datos de contacto</h4>
                <div className="space-y-1 text-sm text-stone-600">
                  <p><strong>👤 Nombre:</strong> {nombre}</p>
                  <p><strong>📞 Teléfono:</strong> {telefono}</p>
                  <p><strong>📧 Email:</strong> {email}</p>
                </div>
              </div>

              {/* Fecha y hora */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-[#3d2817] mb-2 text-sm uppercase">Fecha y hora</h4>
                <div className="space-y-1 text-sm text-stone-600">
                  <p><strong>📅 Fecha:</strong> {fecha}</p>
                  <p><strong>⏰ Hora:</strong> {horario}</p>
                </div>
              </div>

              {/* Servicios */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-[#3d2817] mb-2 text-sm uppercase">Servicios seleccionados</h4>
                <div className="space-y-2 text-sm text-stone-600">
                  {terapiasSeleccionadas.length > 0 && (
                    <div>
                      <p className="font-semibold mb-1">Terapias ({terapiasSeleccionadas.length}):</p>
                      <ul className="list-disc list-inside ml-2 space-y-1">
                        {terapiasSeleccionadas.map((id) => {
                          const terapia = terapiasActualizadas.find(t => t.id === id);
                          return terapia ? (
                            <li key={id}>{terapia.icon} {terapia.nombre}</li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  )}
                  {serviciosSeleccionados.length > 0 && (
                    <div>
                      <p className="font-semibold mb-1">Servicios adicionales ({serviciosSeleccionados.length}):</p>
                      <ul className="list-disc list-inside ml-2 space-y-1">
                        {serviciosSeleccionados.map((id) => {
                          const servicio = serviciosAdicionales.find(s => s.id === id);
                          return servicio ? (
                            <li key={id}>{servicio.icon} {servicio.nombre}</li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  )}
                  {productosSeleccionados.length > 0 && (
                    <div>
                      <p className="font-semibold mb-1">Productos ({productosSeleccionados.length}):</p>
                      <ul className="list-disc list-inside ml-2 space-y-1">
                        {productosSeleccionados.map((id) => {
                          const producto = productosActualizados.find(p => p.id === id);
                          return producto ? (
                            <li key={id}>{producto.icon} {producto.nombre}</li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  )}
                  <p className="pt-2 border-t border-stone-200 mt-2"><strong>⏱️ Duración total:</strong> {calcularDuracionTotal()} minutos</p>
                </div>
              </div>

              {/* Total */}
              {(() => {
                const totalInfo = calcularTotal();
                return (
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-[#3d2817] mb-2 text-sm uppercase">Total</h4>
                    <div className="space-y-2 text-sm">
                      {totalInfo.tienePromocion && totalInfo.promocionActiva && (
                        <div className="mb-2 p-2 bg-green-50 rounded border border-green-200">
                          <p className="text-stone-500 line-through text-xs">Subtotal: ${totalInfo.totalOriginal.toLocaleString('es-CO')}</p>
                          <p className="text-green-600 font-semibold text-xs">
                            🎁 {totalInfo.promocionActiva.titulo || 'Promoción'}: -${totalInfo.descuentoPromocion.toLocaleString('es-CO')}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                        <p className="font-semibold text-[#3d2817]">Total a pagar:</p>
                        <p className="text-xl font-bold text-green-600">${totalInfo.total.toLocaleString('es-CO')}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <button
                onClick={resetearFormulario}
                className="bg-gradient-to-r from-[#3d2817] to-[#2d1f11] text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              >
                ✨ Hacer otra reserva
              </button>
              <Link
                href="/"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto text-center"
              >
                🏠 Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-100 py-12 px-4">
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
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

        {/* Mensaje flotante informativo sobre descuento de afiliados */}
        {showAfiliadoInfo && (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl shadow-2xl p-6 animate-slide-up">
            <button
              onClick={() => setShowAfiliadoInfo(false)}
              className="absolute top-2 right-2 text-stone-400 hover:text-stone-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-start gap-4">
              <div className="text-4xl">🏅</div>
              <div className="flex-1">
                <h3 className="font-bold text-[#3d2817] mb-2 text-lg">¿Eres Afiliado?</h3>
                <p className="text-sm text-stone-700 mb-3">
                  Si eres afiliado, obtendrás un <strong className="text-green-600">20% de descuento</strong> en el total de tu reserva, aplicable a:
                </p>
                <ul className="text-xs text-stone-600 space-y-1 mb-3 list-disc list-inside">
                  <li>Servicios adicionales (Sauna, Jacuzzi, Baño Turco)</li>
                  <li>Total de tu cuenta</li>
                </ul>
                <p className="text-xs text-stone-500 italic">
                  El descuento se aplicará automáticamente al finalizar tu reserva.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-12">
          <div className="flex items-start justify-center gap-4 md:gap-8">
            {[1, 2, 3, 4].map((num) => {
              const labels = ['Terapias', 'Fecha y hora', 'Datos personales', 'Confirmación'];
              const isActive = paso === num;
              const isCompleted = paso > num;
              
              return (
                <React.Fragment key={num}>
                  <div className="flex flex-col items-center gap-2 flex-1 max-w-[120px]">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all duration-300 ${
                      isActive || isCompleted ? 'bg-[#3d2817] text-white scale-110' : 'bg-stone-200 text-stone-500'
                    }`}>
                      {num}
                    </div>
                    <span className={`text-xs md:text-sm text-center transition-all duration-300 ${
                      isActive ? 'font-bold text-[#3d2817]' : isCompleted ? 'text-[#3d2817]' : 'text-stone-600'
                    }`}>
                      {labels[num - 1]}
                    </span>
                  </div>
                  {num < 4 && (
                    <div className={`h-1 flex-1 max-w-16 rounded transition-all duration-300 mt-6 ${
                      isCompleted ? 'bg-[#3d2817]' : 'bg-stone-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-12">

          {paso === 1 && (
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
                              // Usar el precio actualizado desde la API (ya sincronizado)
                              const precioBase = terapia.precio;
                              let precioFinal = precioBase;
                              let descuentoAplicado = 0;
                              
                              if (descuentosServicios[terapia.id]) {
                                descuentoAplicado = descuentosServicios[terapia.id];
                                precioFinal = precioBase * (1 - descuentoAplicado / 100);
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
                                        ${precioBase.toLocaleString('es-CO')}
                                      </span>
                                    )}
                                    <span className="text-sm font-bold text-[#3d2817]">
                                      ${isNaN(precioFinal) || !isFinite(precioFinal) ? precioBase.toLocaleString('es-CO') : Math.round(precioFinal).toLocaleString('es-CO')}
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

              {(terapiasSeleccionadas.length > 0 || serviciosSeleccionados.length > 0 || productosSeleccionados.length > 0) ? (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#3d2817] text-lg">Resumen de selección:</h3>
                    <span className="text-sm text-stone-600">
                      {terapiasSeleccionadas.length} terapia(s) • {serviciosSeleccionados.length} servicio(s) adicional(es) • {productosSeleccionados.length} producto(s)
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
                                  // Usar el precio actualizado desde la API
                                  const precioBase = terapia.precio;
                                  let precioFinal = precioBase;
                                  let descuentoAplicado = 0;
                                  
                                  if (descuentosServicios[id]) {
                                    descuentoAplicado = descuentosServicios[id];
                                    precioFinal = precioBase * (1 - descuentoAplicado / 100);
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
                                            ${precioBase.toLocaleString('es-CO')}
                                          </span>
                                        )}
                                        <span className="text-sm font-bold text-[#3d2817]">
                                          ${isNaN(precioFinal) || !isFinite(precioFinal) ? precioBase.toLocaleString('es-CO') : Math.round(precioFinal).toLocaleString('es-CO')}
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

                  {/* Servicios Adicionales */}
                  {serviciosSeleccionados.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-stone-600 mb-2 uppercase">Servicios Adicionales:</p>
                      <div className="space-y-2">
                        {serviciosSeleccionados.map((id) => {
                          const servicio = serviciosAdicionales.find(s => s.id === id);
                          if (!servicio) return null;
                          const precio = esAfiliado ? servicio.precioAfiliado : servicio.precioParticular;
                          return (
                            <div key={id} className="flex items-center justify-between bg-white rounded-lg p-3">
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-2xl">{servicio.icon}</span>
                                <div>
                                  <span className="text-sm font-semibold text-[#3d2817] block">{servicio.nombre}</span>
                                  {esAfiliado && (
                                    <span className="text-xs text-green-600 font-semibold">Precio afiliado</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  {esAfiliado && servicio.precioParticular && (
                                    <span className="text-xs text-stone-500 line-through block">
                                      ${servicio.precioParticular.toLocaleString('es-CO')}
                                    </span>
                                  )}
                                  <span className="text-sm font-bold text-green-600">
                                    ${precio?.toLocaleString('es-CO')}
                                  </span>
                                </div>
                                <button
                                  onClick={() => toggleServicio(id)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                  title="Quitar servicio"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Productos */}
                  {productosSeleccionados.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-stone-600 mb-2 uppercase">Productos:</p>
                      <div className="space-y-2">
                        {productosSeleccionados.map((id) => {
                          const producto = productosActualizados.find(p => p.id === id);
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

                  <div className="pt-4 border-t-2 border-amber-300">
                    {(() => {
                      const totalInfo = calcularTotal();
                      const tieneDescuentos = totalInfo.descuentosIndividuales > 0 || totalInfo.descuentoAfiliado > 0 || totalInfo.descuentoPromocion > 0;
                      
                      return (
                        <div className="space-y-3">
                          {/* Duración */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-stone-600">⏱️ Duración total:</span>
                            <span className="text-base font-bold text-[#3d2817]">{calcularDuracionTotal()} min</span>
                          </div>

                          {/* Descuentos (si existen) */}
                          {tieneDescuentos && (
                            <div className="bg-green-50 rounded-lg p-2 space-y-1">
                              {totalInfo.descuentosIndividuales > 0 && (
                                <div className="flex justify-between text-xs">
                                  <span className="text-green-700">Desc. individuales:</span>
                                  <span className="font-bold text-green-700">-${totalInfo.descuentosIndividuales.toLocaleString('es-CO')}</span>
                                </div>
                              )}
                              {totalInfo.esAfiliado && totalInfo.descuentoAfiliado > 0 && (
                                <div className="flex justify-between text-xs">
                                  <span className="text-green-700">Desc. Afiliado:</span>
                                  <span className="font-bold text-green-700">-${totalInfo.descuentoAfiliado.toLocaleString('es-CO')}</span>
                                </div>
                              )}
                              {totalInfo.tienePromocion && totalInfo.descuentoPromocion > 0 && (
                                <div className="flex justify-between text-xs">
                                  <span className="text-green-700">🎁 Promoción:</span>
                                  <span className="font-bold text-green-700">-${totalInfo.descuentoPromocion.toLocaleString('es-CO')}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Total */}
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-stone-600">Total a pagar:</span>
                              {tieneDescuentos && (
                                <p className="text-xs text-stone-400 line-through">
                                  ${totalInfo.subtotalOriginal.toLocaleString('es-CO')}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">${totalInfo.total.toLocaleString('es-CO')}</p>
                              {tieneDescuentos && (
                                <p className="text-xs text-green-600 font-semibold">
                                  Ahorro: ${(totalInfo.subtotalOriginal - totalInfo.total).toLocaleString('es-CO')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="bg-stone-50 rounded-2xl p-6 border-2 border-stone-200 text-center">
                  <p className="text-stone-600 mb-2">💡 Selecciona una o más terapias haciendo clic en las tarjetas</p>
                  <p className="text-sm text-stone-500">Puedes seleccionar múltiples terapias para tu sesión</p>
                </div>
              )}

              {/* Servicios Adicionales - Individuales */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#3d2817]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    ✨ Servicios Adicionales
                  </h3>
                  {esAfiliado && (
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                      🏅 Precio afiliado activo
                    </span>
                  )}
                </div>
                <p className="text-sm text-stone-600 mb-4">Selecciona uno o varios servicios adicionales:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {serviciosAdicionales.map((servicio) => {
                    const precio = esAfiliado ? servicio.precioAfiliado : servicio.precioParticular;
                    const precioOriginal = servicio.precioParticular;
                    const isSelected = serviciosSeleccionados.includes(servicio.id);
                    
                    return (
                      <button
                        key={servicio.id}
                        onClick={() => toggleServicio(servicio.id)}
                        className={`p-5 rounded-xl border-4 transition-all duration-300 ${
                          isSelected
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-105'
                            : 'border-stone-200 hover:border-blue-300 bg-white hover:scale-102'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <span className="text-4xl mb-3">{servicio.icon}</span>
                          <h4 className="font-bold text-[#3d2817] mb-2">{servicio.nombre}</h4>
                          <div className="mb-3">
                            {esAfiliado && precioOriginal && (
                              <p className="text-xs text-stone-500 line-through">
                                ${precioOriginal.toLocaleString('es-CO')}
                              </p>
                            )}
                            <p className="text-xl font-bold text-blue-600">
                              ${precio?.toLocaleString('es-CO')}
                            </p>
                            {esAfiliado && (
                              <p className="text-xs text-green-600 font-semibold mt-1">
                                Ahorras ${((precioOriginal || 0) - (precio || 0)).toLocaleString('es-CO')}
                              </p>
                            )}
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-stone-300'
                          }`}>
                            {isSelected && (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Productos del Spa */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                <h3 className="text-xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  🛍️ Productos Adicionales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productosActualizados.map((producto) => (
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

              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
                <button
                  onClick={() => setPaso(2)}
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

          {paso === 2 && (
            <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#3d2817] text-center mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Selecciona Fecha y Hora
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-lg font-semibold text-[#3d2817] mb-4">
                    📅 Fecha
                  </label>
                  <div className="space-y-3">
                    <input
                      type="date"
                      value={fecha}
                      onChange={(e) => {
                        const fechaSeleccionada = e.target.value;
                        if (fechaSeleccionada) {
                          if (esDiaValido(fechaSeleccionada)) {
                            setFecha(fechaSeleccionada);
                            setMensajeErrorFecha(''); // Limpiar mensaje de error si hay uno
                            // Si el horario actual no está disponible para la nueva fecha, limpiarlo
                            if (!obtenerHorariosDisponibles(fechaSeleccionada).includes(horario)) {
                              setHorario('');
                            }
                          } else {
                            // Si el día no es válido, mostrar mensaje y no actualizar
                            setFecha('');
                            setMensajeErrorFecha('⚠️ Este día no está disponible. Por favor selecciona un día de Jueves a Domingo.');
                            // Limpiar el mensaje después de 5 segundos
                            setTimeout(() => setMensajeErrorFecha(''), 5000);
                          }
                        } else {
                          setFecha('');
                          setMensajeErrorFecha('');
                        }
                      }}
                      min={fechasDisponibles[0] || new Date().toISOString().split('T')[0]}
                      max={fechasDisponibles[fechasDisponibles.length - 1]}
                      className={`w-full p-4 rounded-2xl border-4 text-lg ${
                        fecha && !esDiaValido(fecha)
                          ? 'border-red-300 bg-red-50'
                          : 'border-stone-200 focus:border-[#3d2817] focus:outline-none'
                      }`}
                    />
                    {mensajeErrorFecha && (
                      <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl animate-fade-in">
                        <p className="text-sm text-red-600 font-semibold">{mensajeErrorFecha}</p>
                      </div>
                    )}
                    {fecha && esDiaValido(fecha) && (
                      <div className="p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                        <p className="text-sm text-green-700 font-semibold">✓ Día disponible</p>
                        <p className="text-xs text-green-600 mt-1">
                          {new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    )}
                    {!fecha && !mensajeErrorFecha && (
                      <p className="text-sm text-stone-500 italic">Selecciona una fecha disponible (Jueves a Domingo)</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-[#3d2817] mb-4">
                    ⏰ Horario
                  </label>
                  {!fecha || !esDiaValido(fecha) ? (
                    <div className="p-8 border-2 border-stone-200 rounded-2xl bg-stone-50 text-center">
                      <p className="text-stone-500 font-semibold">Selecciona primero una fecha disponible</p>
                      <p className="text-xs text-stone-400 mt-2">Los horarios aparecerán después de seleccionar la fecha</p>
                    </div>
                  ) : horariosDisponiblesParaFecha.length === 0 ? (
                    <div className="p-8 border-2 border-yellow-200 rounded-2xl bg-yellow-50 text-center space-y-2">
                      <p className="text-yellow-800 font-semibold text-lg">⏰ No hay horarios disponibles para este día</p>
                      <p className="text-yellow-700 text-sm">
                        {(() => {
                          const fechaSeleccionada = new Date(fecha + 'T00:00:00');
                          const hoy = new Date();
                          hoy.setHours(0, 0, 0, 0);
                          
                          if (fechaSeleccionada.getTime() === hoy.getTime()) {
                            return '💡 Los horarios de hoy ya pasaron. Por favor selecciona otro día.';
                          } else {
                            return 'Por favor selecciona otra fecha.';
                          }
                        })()}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Filtro de horarios */}
                      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-xs text-blue-700">
                          💡 Solo se muestran horarios con al menos 1 hora de anticipación
                        </p>
                        <button
                          onClick={() => setMostrarSoloDisponibles(!mostrarSoloDisponibles)}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                            mostrarSoloDisponibles
                              ? 'bg-green-600 text-white shadow-md hover:bg-green-700'
                              : 'bg-white text-blue-700 border-2 border-blue-300 hover:bg-blue-100'
                          }`}
                        >
                          {mostrarSoloDisponibles ? '✓ Solo disponibles' : '📋 Mostrar todos'}
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-2">
                        {horariosDisponiblesParaFecha.map((horarioItem) => {
                          // Validar en tiempo real si este horario ya pasó
                          const fechaHoraSeleccion = new Date(fecha + 'T' + horarioItem + ':00');
                          const ahora = new Date();
                          const margenTiempo = 60 * 60 * 1000; // 60 minutos (1 hora)
                          const ahoraConMargen = new Date(ahora.getTime() + margenTiempo);
                          const horarioPasado = fechaHoraSeleccion < ahoraConMargen;
                          
                          // Verificar si el horario está ocupado
                          const estaOcupado = verificarHorarioOcupado(fecha, horarioItem);
                          
                          return (
                            <button
                              key={horarioItem}
                              onClick={() => {
                                if (horarioPasado) {
                                  setMensajeErrorHorario('⚠️ Este horario ya no está disponible. Necesitas al menos 1 hora de anticipación.');
                                  setTimeout(() => setMensajeErrorHorario(''), 5000);
                                } else if (estaOcupado) {
                                  setMensajeErrorHorario(`⚠️ Horario ocupado. Este horario ya está reservado. Por favor selecciona otro.`);
                                  setTimeout(() => setMensajeErrorHorario(''), 5000);
                                } else {
                                  setHorario(horarioItem);
                                  setMensajeErrorHorario(''); // Limpiar error al seleccionar horario válido
                                }
                              }}
                              disabled={horarioPasado}
                              className={`p-3 rounded-xl border-2 transition-all duration-300 font-semibold relative ${
                                horarioPasado
                                  ? 'border-red-200 bg-red-50 text-red-400 cursor-not-allowed opacity-50'
                                  : estaOcupado
                                  ? 'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 cursor-pointer'
                                  : horario === horarioItem
                                  ? 'border-[#3d2817] bg-[#3d2817] text-white shadow-lg scale-105'
                                  : 'border-stone-200 hover:border-amber-300 bg-white text-[#3d2817] hover:shadow-md'
                              }`}
                            >
                              {horarioItem}
                              {horarioPasado && <span className="block text-xs mt-1">No disponible</span>}
                              {!horarioPasado && estaOcupado && (
                                <span className="block text-xs mt-1 font-medium">🔒 Ocupado</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {horario && !verificarHorarioOcupado(fecha, horario) && (
                        <div className="p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                          <p className="text-sm text-green-700 font-semibold">✓ Horario seleccionado: {horario}</p>
                        </div>
                      )}
                      
                      {mensajeErrorHorario && (
                        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-fade-in">
                          <div className="flex items-start gap-2">
                            <span className="text-xl">⚠️</span>
                            <div className="flex-1">
                              <p className="text-sm text-red-700 font-semibold">{mensajeErrorHorario}</p>
                              <button
                                onClick={() => setMostrarSoloDisponibles(true)}
                                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-all duration-300"
                              >
                                ✓ Mostrar solo horas disponibles
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
                  onClick={() => {
                    if (verificarHorarioOcupado(fecha, horario)) {
                      setMensajeErrorHorario('⚠️ Horario ocupado. Este horario ya está reservado. Por favor selecciona otro disponible.');
                      setTimeout(() => setMensajeErrorHorario(''), 5000);
                    } else {
                      setPaso(3);
                    }
                  }}
                  disabled={!fecha || !horario || !esDiaValido(fecha) || verificarHorarioOcupado(fecha, horario)}
                  className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                    !fecha || !horario || !esDiaValido(fecha) || verificarHorarioOcupado(fecha, horario)
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
                    placeholder="Juan Pérez"
                    minLength={3}
                    className="w-full p-4 rounded-xl border-2 border-stone-200 focus:border-[#3d2817] focus:outline-none"
                    required
                  />
                  {nombre.length > 0 && nombre.length < 3 && (
                    <p className="text-xs text-red-600 mt-1">❌ El nombre debe tener al menos 3 caracteres</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => handleTelefonoChange(e.target.value)}
                    placeholder="3012456789"
                    maxLength={10}
                    className={`w-full p-4 rounded-xl border-2 focus:outline-none transition-colors ${
                      telefono.length === 0
                        ? 'border-stone-200 focus:border-[#3d2817]'
                        : errorTelefono
                        ? 'border-red-400 bg-red-50 focus:border-red-500'
                        : 'border-green-400 bg-green-50 focus:border-green-500'
                    }`}
                    required
                  />
                  {errorTelefono && (
                    <p className="text-xs text-red-600 mt-1">❌ {errorTelefono}</p>
                  )}
                  {telefono.length > 0 && !errorTelefono && (
                    <p className="text-xs text-green-600 mt-1">✓ Teléfono válido</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className={`w-full p-4 rounded-xl border-2 focus:outline-none transition-colors ${
                      email.length === 0
                        ? 'border-stone-200 focus:border-[#3d2817]'
                        : errorEmail
                        ? 'border-red-400 bg-red-50 focus:border-red-500'
                        : 'border-green-400 bg-green-50 focus:border-green-500'
                    }`}
                    required
                  />
                  {errorEmail && (
                    <p className="text-xs text-red-600 mt-1">❌ {errorEmail}</p>
                  )}
                  {email.length > 0 && !errorEmail && (
                    <p className="text-xs text-green-600 mt-1">✓ Email válido</p>
                  )}
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

              <div className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
                <button
                  onClick={() => setPaso(2)}
                  className="bg-stone-200 hover:bg-stone-300 text-[#3d2817] px-8 py-3 rounded-full font-semibold transition-all duration-300"
                >
                  ← Volver
                </button>
                <button
                  onClick={() => setPaso(4)}
                  disabled={!nombre || !telefono || !email || !!errorTelefono || !!errorEmail}
                  className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                    !nombre || !telefono || !email || !!errorTelefono || !!errorEmail
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
                Confirma tu Reserva
              </h2>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
                <h3 className="font-bold text-[#3d2817] text-lg mb-4">Resumen de tu reserva:</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-sm text-stone-600 mb-1"><strong>📅 Fecha:</strong> {fecha}</p>
                    <p className="text-sm text-stone-600"><strong>⏰ Hora:</strong> {horario}</p>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <p className="text-sm text-stone-600 mb-1"><strong>👤 Nombre:</strong> {nombre}</p>
                    <p className="text-sm text-stone-600 mb-1"><strong>📞 Teléfono:</strong> {telefono}</p>
                    <p className="text-sm text-stone-600"><strong>📧 Email:</strong> {email}</p>
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
                                // Usar el precio actualizado desde la API
                                const precioBase = terapia.precio;
                                let precioFinal = precioBase;
                                let descuentoAplicado = 0;
                                
                                if (descuentosServicios[id]) {
                                  descuentoAplicado = descuentosServicios[id];
                                  precioFinal = precioBase * (1 - descuentoAplicado / 100);
                                }
                                
                                return (
                                  <div className="text-right">
                                    {descuentoAplicado > 0 && (
                                      <span className="text-xs text-stone-400 line-through block">
                                        ${precioBase.toLocaleString('es-CO')}
                                      </span>
                                    )}
                                    <span className="font-bold text-[#3d2817]">
                                      ${isNaN(precioFinal) || !isFinite(precioFinal) ? precioBase.toLocaleString('es-CO') : Math.round(precioFinal).toLocaleString('es-CO')}
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

                  {/* Servicios Adicionales */}
                  {serviciosSeleccionados.length > 0 && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs font-semibold text-stone-600 mb-2 uppercase">Servicios Adicionales:</p>
                      <div className="space-y-2">
                        {serviciosSeleccionados.map((id) => {
                          const servicio = serviciosAdicionales.find(s => s.id === id);
                          if (!servicio) return null;
                          const precio = esAfiliado ? servicio.precioAfiliado : servicio.precioParticular;
                          return (
                            <div key={id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span>{servicio.icon}</span>
                                <div>
                                  <span className="text-[#3d2817]">{servicio.nombre}</span>
                                  {esAfiliado && (
                                    <span className="text-xs text-green-600 font-semibold ml-2">
                                      (Afiliado)
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="font-bold text-green-600">
                                ${precio?.toLocaleString('es-CO')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Productos */}
                  {productosSeleccionados.length > 0 && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs font-semibold text-stone-600 mb-2 uppercase">Productos ({productosSeleccionados.length}):</p>
                      <div className="space-y-2">
                        {productosSeleccionados.map((id) => {
                          const producto = productosActualizados.find(p => p.id === id);
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
                  {(() => {
                    const totalInfo = calcularTotal();
                    const tieneDescuentos = totalInfo.descuentosIndividuales > 0 || totalInfo.descuentoAfiliado > 0 || totalInfo.descuentoPromocion > 0;
                    
                    return (
                      <div className="space-y-3">
                        {/* Título del resumen */}
                        <h4 className="font-bold text-[#3d2817] text-lg">💰 Resumen Financiero</h4>
                        
                        {/* Desglose de montos originales */}
                        <div className="bg-white rounded-lg p-3 space-y-2">
                          {totalInfo.totalTerapiasOriginal > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-stone-600">Terapias:</span>
                              <span className="font-semibold text-[#3d2817]">${totalInfo.totalTerapiasOriginal.toLocaleString('es-CO')}</span>
                            </div>
                          )}
                          {totalInfo.totalServiciosOriginal > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-stone-600">Servicios Adicionales:</span>
                              <span className="font-semibold text-[#3d2817]">${totalInfo.totalServiciosOriginal.toLocaleString('es-CO')}</span>
                            </div>
                          )}
                          {totalInfo.totalProductosOriginal > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-stone-600">Productos:</span>
                              <span className="font-semibold text-[#3d2817]">${totalInfo.totalProductosOriginal.toLocaleString('es-CO')}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm pt-2 border-t border-stone-200">
                            <span className="font-semibold text-stone-700">Subtotal:</span>
                            <span className="font-bold text-[#3d2817]">${totalInfo.subtotalOriginal.toLocaleString('es-CO')}</span>
                          </div>
                        </div>

                        {/* Descuentos aplicados */}
                        {tieneDescuentos && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                            <p className="text-xs font-bold text-green-700 mb-2 uppercase">✨ Descuentos Aplicados</p>
                            <div className="space-y-1">
                              {totalInfo.descuentosIndividuales > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-green-700">Descuentos individuales:</span>
                                  <span className="font-bold text-green-700">-${totalInfo.descuentosIndividuales.toLocaleString('es-CO')}</span>
                                </div>
                              )}
                              {totalInfo.esAfiliado && totalInfo.descuentoAfiliado > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-green-700">🏅 Descuento Afiliado (20%):</span>
                                  <span className="font-bold text-green-700">-${totalInfo.descuentoAfiliado.toLocaleString('es-CO')}</span>
                                </div>
                              )}
                              {totalInfo.tienePromocion && totalInfo.descuentoPromocion > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-green-700">🎁 {totalInfo.promocionActiva?.titulo || 'Promoción'}:</span>
                                  <span className="font-bold text-green-700">-${totalInfo.descuentoPromocion.toLocaleString('es-CO')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Total final */}
                        <div className="bg-gradient-to-r from-[#3d2817] to-[#2d1f11] rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-amber-200 mb-1">Total a Pagar:</p>
                              {tieneDescuentos && (
                                <p className="text-xs text-stone-300 line-through">
                                  Antes: ${totalInfo.subtotalOriginal.toLocaleString('es-CO')}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-bold text-white">${totalInfo.total.toLocaleString('es-CO')}</p>
                              {tieneDescuentos && (
                                <p className="text-xs text-green-300 font-semibold">
                                  Ahorro: ${(totalInfo.subtotalOriginal - totalInfo.total).toLocaleString('es-CO')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Mensaje de error de horario ocupado */}
              {mensajeErrorHorario && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-fade-in">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div className="flex-1">
                      <p className="text-base text-red-700 font-bold mb-1">{mensajeErrorHorario}</p>
                      <p className="text-sm text-red-600">Por favor regresa al paso anterior y selecciona otro horario disponible.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
                <button
                  onClick={() => {
                    setPaso(3);
                    setMensajeErrorHorario(''); // Limpiar error al volver
                  }}
                  className="bg-stone-200 hover:bg-stone-300 text-[#3d2817] px-8 py-3 rounded-full font-semibold transition-all duration-300"
                >
                  ← Volver
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !!mensajeErrorHorario}
                  className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                    submitting || mensajeErrorHorario
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
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
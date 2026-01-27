"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCMS } from '@/app/hooks/useCMS';

// Helper para codificar URLs de imágenes
function getImagePath(filename: string): string {
  return `/image/${encodeURIComponent(filename)}`;
}

const servicios = [
  {
    categoria: "Terapias de Rehabilitación",
    descripcion: "Tratamientos especializados para recuperación y alivio del dolor",
    servicios: [
      { 
        key: "columna", 
        title: "THERAPY LESIONES DE COLUMNA", 
        duration: "30 min", 
        price: 100000,
        priceLabel: "desde $100.000", 
        icon: "🦴",
        imagen: getImagePath("therapy lesiones de columna 2.jpg"),
        detalles: [
          "Evaluación postural completa",
          "Terapia manual especializada",
          "Ejercicios de fortalecimiento",
          "Técnicas de alivio del dolor",
          "Plan de seguimiento personalizado"
        ]
      },
      { 
        key: "brazos", 
        title: "THERAPY LESIONES MUSCULARES BRAZOS", 
        duration: "30 min", 
        price: 180000,
        priceLabel: "Paquete 3 sesiones $180.000", 
        icon: "💪",
        imagen: getImagePath("lesiones de brazo.jpg"),
        detalles: [
          "Masaje profundo de tejidos",
          "Liberación miofascial",
          "Estiramientos terapéuticos",
          "Fortalecimiento muscular",
          "Reducción de tensión"
        ]
      },
      { 
        key: "piernas", 
        title: "THERAPY LESIONES MUSCULARES PIERNAS", 
        duration: "30 min", 
        price: 180000,
        priceLabel: "Paquete 3 sesiones $180.000", 
        icon: "🦵",
        imagen: getImagePath("masaje de piernas.jpg") + "?v=2",
        detalles: [
          "Terapia de tejidos blandos",
          "Movilización articular",
          "Ejercicios de rehabilitación",
          "Mejora de flexibilidad",
          "Prevención de lesiones"
        ]
      },
      { 
        key: "hombro", 
        title: "THERAPY TRAUMA HOMBRO, CODO, MUÑECA", 
        duration: "30 min", 
        price: 250000,
        priceLabel: "Paquete 5 sesiones $250.000", 
        icon: "🤝",
        imagen: getImagePath("masaje hombro, codo.jpg"),
        detalles: [
          "Evaluación biomecánica",
          "Terapia manual avanzada",
          "Movilización pasiva y activa",
          "Fortalecimiento progresivo",
          "Reeducación del movimiento"
        ]
      },
      { 
        key: "cadera", 
        title: "THERAPY TRAUMA CADERA, RODILLA, TOBILLO", 
        duration: "30 min", 
        price: 250000,
        priceLabel: "Paquete 5 sesiones $250.000", 
        icon: "🦿",
        imagen: getImagePath("masaje cadera.jpg"),
        detalles: [
          "Evaluación funcional",
          "Terapia de estabilización",
          "Ejercicios de propiocepción",
          "Fortalecimiento muscular",
          "Mejora del equilibrio"
        ]
      },
    ]
  },
  {
    categoria: "Tratamientos de Bienestar",
    descripcion: "Experiencias de relajación y cuidado integral",
    servicios: [
      { 
        key: "bienestar-general", 
        title: "MASAJE BIENESTAR GENERAL", 
        duration: "45 min", 
        price: 140000,
        priceLabel: "$140.000", 
        icon: "🌿",
        imagen: getImagePath("masaje general.jfif"),
        detalles: [
          "Masaje corporal completo",
          "Aromaterapia relajante",
          "Música terapéutica",
          "Técnicas de relajación profunda",
          "Mejora de circulación sanguínea"
        ]
      },
      { 
        key: "cuello", 
        title: "MASAJE DE CUELLO", 
        duration: "30 min", 
        price: 90000,
        priceLabel: "$90.000", 
        icon: "💆",
        imagen: getImagePath("masaje cuello.jpg"),
        detalles: [
          "Masaje relajante",
          "Masaje descontracturante",
          "Masaje activador",
          "Limpieza, exfoliación e hidratación de piel",
          "Vibración, percusión y estiramiento articular y muscular",
          "Masajeador capilar y piedras volcánicas",
          "Musicoterapia y aromaterapia"
        ]
      },
      { 
        key: "deportivo", 
        title: "MASAJE THERAPY DEPORTIVO", 
        duration: "40 min", 
        price: 100000,
        priceLabel: "$100.000", 
        icon: "🏃",
        imagen: getImagePath("masaje deportivo.jpg"),
        detalles: [
          "Preparación pre-competencia",
          "Recuperación post-entrenamiento",
          "Liberación de tensión muscular",
          "Mejora de flexibilidad",
          "Prevención de lesiones deportivas"
        ]
      },
      { 
        key: "espalda", 
        title: "MASAJE DE ESPALDA", 
        duration: "30 min", 
        price: 120000,
        priceLabel: "$120.000", 
        icon: "🧘",
        imagen: getImagePath("masaje de espalda.jpg"),
        detalles: [
          "Masaje profundo de espalda",
          "Liberación de nudos musculares",
          "Alivio de contracturas",
          "Mejora de postura",
          "Reducción de estrés"
        ]
      },
          { 
            key: "hombros", 
            title: "MASAJE HOMBROS Y BRAZOS", 
            duration: "30 min", 
            price: 100000,
            priceLabel: "$100.000", 
            icon: "💆",
        imagen: getImagePath("masaje hombros y brazos.jpg"),
        detalles: [
          "Liberación de tensión cervical",
          "Masaje de cuello y hombros",
          "Descontractura muscular",
          "Alivio de dolor de brazos",
          "Mejora de movilidad"
        ]
      },
          { 
            key: "rodillas", 
            title: "MASAJE CADERAS Y RODILLAS", 
            duration: "30 min", 
            price: 120000,
            priceLabel: "$120.000", 
            icon: "🦴",
        imagen: getImagePath("masaje cadera 2.jpg"),
        detalles: [
          "Masaje de miembros inferiores",
          "Liberación de tensión articular",
          "Mejora de circulación",
          "Alivio de rigidez",
          "Fortalecimiento muscular"
        ]
      },
          { 
            key: "pies", 
            title: "MASAJE PANTORRILLAS Y PIES", 
            duration: "30 min", 
            price: 120000,
            priceLabel: "$120.000", 
            icon: "🦶",
        imagen: getImagePath("masaje piernas.jpg"),
        detalles: [
          "Reflexología podal",
          "Masaje de pantorrillas",
          "Liberación de fatiga",
          "Estimulación de puntos reflejos",
          "Relajación profunda"
        ]
      },
    ]
  },
  {
    categoria: "Cuidado Facial y Especializado",
    descripcion: "Tratamientos faciales y terapias específicas de alta calidad",
    servicios: [
      { 
        key: "facial", 
        title: "MASAJE FACIAL", 
        duration: "30 min", 
        price: 90000,
        priceLabel: "$90.000", 
        icon: "✨",
        imagen: getImagePath("masaje facial.jpg"),
        detalles: [
          "Limpieza facial profunda",
          "Masaje linfático facial",
          "Técnicas de lifting natural",
          "Hidratación intensiva",
          "Rejuvenecimiento de la piel"
        ]
      },
      { 
        key: "skincare-mano", 
        title: "SKINCARE MANO THERAPY", 
        duration: "30 min", 
        price: 90000,
        priceLabel: "$90.000", 
        icon: "🤲",
        imagen: getImagePath("skincare mano.jpg"),
        detalles: [
          "Exfoliación suave",
          "Masaje de manos y antebrazos",
          "Hidratación profunda",
          "Tratamiento anti-edad",
          "Nutrición de uñas y cutículas"
        ]
      },
      { 
        key: "preso-ocular", 
        title: "PRESO THERAPY OCULAR", 
        duration: "30 min", 
        price: 80000,
        priceLabel: "$80.000", 
        icon: "👁️",
        imagen: getImagePath("therapy ocular.jpg"),
        detalles: [
          "Masaje de contorno de ojos",
          "Reducción de ojeras",
          "Desinflamación de párpados",
          "Alivio de tensión ocular",
          "Efecto lifting natural"
        ]
      },
    ]
  }
];

export default function ServiciosPage() {
  const { contenido } = useCMS();
  const [categoriaActiva, setCategoriaActiva] = useState(0);
  const [cardFlipped, setCardFlipped] = useState<string | null>(null);
  const [descuentosIndividuales, setDescuentosIndividuales] = useState<Record<string, number>>({});
  const [precios, setPrecios] = useState<Record<string, number>>({});
  const [serviciosAPI, setServiciosAPI] = useState<any[]>([]);

  useEffect(() => {
    // Cargar servicios y descuentos desde la API
    const loadData = async () => {
      try {
        const timestamp = new Date().getTime();
        const [serviciosRes, descuentosRes] = await Promise.all([
          fetch(`/api/admin/servicios?cache=${timestamp}`),
          fetch(`/api/admin/descuentos?cache=${timestamp}`)
        ]);
        
        const serviciosData = await serviciosRes.json();
        const descuentosData = await descuentosRes.json();
        
        setServiciosAPI(serviciosData.servicios || []);
        setDescuentosIndividuales(descuentosData.descuentos || {});
        setPrecios({}); // No se usa por ahora
        console.log('✅ Servicios página actualizada:', serviciosData.servicios?.length || 0);
        console.log('📊 Estados de servicios:', serviciosData.servicios?.map((s: any) => ({ id: s.id, nombre: s.nombre, activo: s.activo })));
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    
    loadData();
    
    // Verificar si hay cambios pendientes en localStorage
    const necesitaRecarga = localStorage.getItem('necesita_recarga');
    if (necesitaRecarga === 'true') {
      console.log('🔔 Página Servicios detectó cambios pendientes en localStorage');
      console.log('🔄 Recargando datos automáticamente...');
      setTimeout(() => loadData(), 100);
      setTimeout(() => loadData(), 500);
    }

    // Escuchar eventos de actualización
    const handleServicioActualizado = (event: any) => {
      console.log('📄 Página Servicios - ⚡ EVENTO CAPTURADO: servicioActualizado', event?.detail);
      console.log('🔄 Recargando servicios AHORA...');
      loadData();
      setTimeout(() => loadData(), 100);
      setTimeout(() => loadData(), 300);
      setTimeout(() => loadData(), 600);
    };

    const handleDescuentoActualizado = (event: any) => {
      console.log('📄 Página Servicios - ⚡ EVENTO CAPTURADO: descuentoActualizado', event?.detail);
      console.log('🔄 Recargando servicios AHORA...');
      loadData();
      setTimeout(() => loadData(), 100);
      setTimeout(() => loadData(), 300);
      setTimeout(() => loadData(), 600);
    };

    const handleActualizarPaginaPrincipal = (event: any) => {
      console.log('📄 Página Servicios - ⚡⚡⚡ EVENTO GLOBAL CAPTURADO: actualizarPaginaPrincipal ⚡⚡⚡', event?.detail);
      console.log('🔄🔄🔄 RECARGA COMPLETA INICIADA 🔄🔄🔄');
      loadData();
      setTimeout(() => loadData(), 100);
      setTimeout(() => loadData(), 300);
      setTimeout(() => loadData(), 600);
      setTimeout(() => loadData(), 1000);
      setTimeout(() => {
        console.log('✅ Página Servicios - Recarga completa finalizada');
      }, 1100);
    };

    window.addEventListener('servicioActualizado', handleServicioActualizado, true);
    window.addEventListener('descuentoActualizado', handleDescuentoActualizado, true);
    window.addEventListener('actualizarPaginaPrincipal', handleActualizarPaginaPrincipal, true);

    return () => {
      window.removeEventListener('servicioActualizado', handleServicioActualizado, true);
      window.removeEventListener('descuentoActualizado', handleDescuentoActualizado, true);
      window.removeEventListener('actualizarPaginaPrincipal', handleActualizarPaginaPrincipal, true);
    };
  }, []);

  const handleReservar = (servicio: any) => {
    // Redirigir a reservas con el servicio precargado
    window.location.href = `/reservas?servicio=${servicio.key}`;
  };

  const getPrecioConDescuento = (servicio: any) => {
    const servicioId = servicio.key || servicio.id;
    
    // Buscar el servicio en serviciosAPI para obtener el precio actualizado
    const servicioAPI = serviciosAPI.find(s => s.id === servicioId);
    const precioBase = servicioAPI?.precio || servicio.price;
    const descuento = descuentosIndividuales[servicioId];
    
    if (descuento && descuento > 0) {
      const precioConDescuento = precioBase * (1 - descuento / 100);
      return {
        precioOriginal: precioBase,
        precioConDescuento: Math.round(precioConDescuento),
        descuento: descuento,
        tieneDescuento: true
      };
    }
    
    return {
      precioOriginal: precioBase,
      precioConDescuento: precioBase,
      descuento: 0,
      tieneDescuento: false
    };
  };
  
  // Función para obtener la duración actualizada desde la API
  const getDuracionActualizada = (servicio: any) => {
    const servicioId = servicio.key || servicio.id;
    const servicioAPI = serviciosAPI.find(s => s.id === servicioId);
    return servicioAPI?.duracion ? `${servicioAPI.duracion} min` : servicio.duration;
  };
  
  // Función para obtener el nombre actualizado desde la API
  const getNombreActualizado = (servicio: any) => {
    const servicioId = servicio.key || servicio.id;
    const servicioAPI = serviciosAPI.find(s => s.id === servicioId);
    return servicioAPI?.nombre || servicio.title;
  };

  // Función para obtener la imagen actualizada desde la API
  const getImagenActualizada = (servicio: any) => {
    const servicioId = servicio.key || servicio.id;
    const servicioAPI = serviciosAPI.find(s => s.id === servicioId);
    if (servicioAPI?.imagen) {
      const imagenPath = getImagePath(servicioAPI.imagen);
      console.log(`🖼️ Imagen para ${servicioId}: ${servicioAPI.imagen} → ${imagenPath}`);
      return imagenPath;
    }
    // Si no hay imagen en la API, usar la imagen hardcodeada
    return servicio.imagen;
  };

  // Verificar si hay imagen válida
  const tieneImagenValida = (servicio: any) => {
    const servicioId = servicio.key || servicio.id;
    const servicioAPI = serviciosAPI.find(s => s.id === servicioId);
    
    // Tiene imagen de la API
    if (servicioAPI?.imagen && servicioAPI.imagen.trim() !== '') return true;
    
    // Tiene imagen hardcodeada válida
    if (servicio.imagen && 
        servicio.imagen.trim() !== '' && 
        !servicio.imagen.includes('default-service.jpg')) {
      return true;
    }
    
    return false;
  };

  // Función para combinar servicios hardcodeados con servicios de la API
  const getServiciosMezclados = () => {
    if (serviciosAPI.length === 0) {
      // Si no hay servicios de la API, usar solo los hardcodeados
      return servicios;
    }

    // ✅ SOLO LAS 3 CATEGORÍAS ORIGINALES
    const categoriasPermitidas = [
      "Terapias de Rehabilitación",
      "Tratamientos de Bienestar",
      "Cuidado Facial y Especializado"
    ];

    // Crear mapa de servicios por categoría (SOLO categorías originales)
    const serviciosPorCategoria: Record<string, any[]> = {};

    // Agregar servicios hardcodeados agrupados por categoría
    servicios.forEach(cat => {
      serviciosPorCategoria[cat.categoria] = [...cat.servicios];
    });

    // Agregar o actualizar servicios desde la API
    serviciosAPI.forEach(servicioAPI => {
      // ✅ Mapear categorías nuevas a las 3 originales
      let categoria = servicioAPI.categoria || "Tratamientos de Bienestar";
      
      // Si la categoría no está en las permitidas, asignar a una categoría por defecto
      if (!categoriasPermitidas.includes(categoria)) {
        // Asignar a "Tratamientos de Bienestar" por defecto
        categoria = "Tratamientos de Bienestar";
        console.log(`📁 Servicio "${servicioAPI.nombre}" con categoría "${servicioAPI.categoria}" asignado a "Tratamientos de Bienestar"`);
      }

      // Buscar el índice del servicio en todas las categorías
      let indexExistente = -1;
      let categoriaExistente = categoria;
      
      for (const cat of categoriasPermitidas) {
        const idx = serviciosPorCategoria[cat].findIndex(
          s => (s.key === servicioAPI.id || s.id === servicioAPI.id)
        );
        if (idx !== -1) {
          indexExistente = idx;
          categoriaExistente = cat;
          break;
        }
      }

      // IMPORTANTE: Si el servicio está INACTIVO, eliminarlo de todas las categorías
      if (servicioAPI.activo !== true) {
        if (indexExistente !== -1) {
          console.log(`🚫 Eliminando servicio inactivo "${servicioAPI.nombre}" de la vista`);
          serviciosPorCategoria[categoriaExistente].splice(indexExistente, 1);
        }
        return; // Saltar servicios inactivos
      }

      const servicioFormateado = {
        key: servicioAPI.id,
        id: servicioAPI.id,
        title: servicioAPI.nombre,
        duration: `${servicioAPI.duracion || 30} min`,
        price: servicioAPI.precio || 0,
        priceLabel: `$${(servicioAPI.precio || 0).toLocaleString('es-CO')}`,
        icon: servicioAPI.icon || '✨',
        imagen: servicioAPI.imagen ? getImagePath(servicioAPI.imagen) : '', // Sin imagen, se mostrará el emoji
        detalles: servicioAPI.descripcion ? [servicioAPI.descripcion] : ["Servicio profesional"]
      };

      if (indexExistente !== -1) {
        // Actualizar servicio existente (puede haber cambiado de categoría)
        serviciosPorCategoria[categoriaExistente].splice(indexExistente, 1);
        serviciosPorCategoria[categoria].push(servicioFormateado);
      } else {
        // Agregar nuevo servicio
        serviciosPorCategoria[categoria].push(servicioFormateado);
      }
    });

    // ✅ Convertir SOLO las 3 categorías originales (mantener orden original)
    return servicios.map(catOriginal => ({
      categoria: catOriginal.categoria,
      descripcion: catOriginal.descripcion,
      servicios: serviciosPorCategoria[catOriginal.categoria] || catOriginal.servicios
    }));
  };

  const serviciosMezclados = getServiciosMezclados();
  
  // Log para debug: mostrar servicios activos vs total
  useEffect(() => {
    const totalServicios = serviciosMezclados.reduce((acc, cat) => acc + cat.servicios.length, 0);
    const serviciosActivos = serviciosAPI.filter(s => s.activo === true).length;
    const serviciosInactivos = serviciosAPI.filter(s => s.activo !== true).length;
    console.log(`📊 Servicios en vista: ${totalServicios} | API activos: ${serviciosActivos} | API inactivos: ${serviciosInactivos}`);
  }, [serviciosMezclados, serviciosAPI]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-100">
      {/* Elementos decorativos flotantes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 text-4xl animate-float">💆</div>
        <div className="absolute top-40 right-20 text-3xl animate-float-delay-1">🌿</div>
        <div className="absolute bottom-32 left-1/4 text-3xl animate-float-delay-2">✨</div>
        <div className="absolute top-1/3 right-1/3 text-2xl animate-float">🧘</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-float-delay-1">🦴</div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Nuestros Servicios
          </h1>
          <p className="text-lg md:text-xl text-stone-600 mb-2">
            💎 Terapias profesionales para tu bienestar integral
          </p>
          <p className="text-sm md:text-base text-stone-500 max-w-3xl mx-auto">
            Descubre nuestra variedad de tratamientos especializados diseñados para tu recuperación, relajación y bienestar completo.
          </p>
        </div>

        {/* Filtros por categoría */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {serviciosMezclados.map((cat, index) => (
            <button
              key={index}
              onClick={() => setCategoriaActiva(index)}
              className={`px-6 py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 transform hover:scale-105 ${
                categoriaActiva === index
                  ? 'bg-[#3d2817] text-white shadow-lg'
                  : 'bg-white text-stone-700 hover:bg-stone-100 shadow-md'
              }`}
            >
              {cat.categoria}
            </button>
          ))}
        </div>

        {/* Sección de categoría activa */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {serviciosMezclados[categoriaActiva]?.categoria || "Servicios"}
            </h2>
            <p className="text-stone-600 text-sm md:text-base">
              {serviciosMezclados[categoriaActiva]?.descripcion || "Servicios especializados"}
            </p>
          </div>

          {/* Grid de servicios con efecto flip */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {(serviciosMezclados[categoriaActiva]?.servicios || []).map((servicio, index) => (
              <div
                key={servicio.key}
                className="perspective-1000 h-[480px]"
                onMouseEnter={() => setCardFlipped(servicio.key)}
                onMouseLeave={() => setCardFlipped(null)}
              >
                <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
                  cardFlipped === servicio.key ? 'rotate-y-180' : ''
                }`}>
                  
                  {/* FRENTE de la tarjeta */}
                  <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Imagen */}
                    <div className="relative h-52 overflow-hidden flex-shrink-0 bg-gradient-to-br from-amber-100 to-stone-200">
                      {tieneImagenValida(servicio) ? (
                        <Image 
                          src={getImagenActualizada(servicio)} 
                          alt={getNombreActualizado(servicio)}
                          fill
                          className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={(e) => {
                            console.warn('⚠️ Error cargando imagen:', getImagenActualizada(servicio));
                            // Ocultar imagen y mostrar emoji
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector('.emoji-placeholder')) {
                              const placeholder = document.createElement('div');
                              placeholder.className = 'emoji-placeholder absolute inset-0 flex items-center justify-center text-7xl';
                              placeholder.textContent = servicio.icon || '✨';
                              parent.appendChild(placeholder);
                            }
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-7xl">
                          {servicio.icon || '✨'}
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <p className="text-xs font-bold text-[#3d2817]">{getDuracionActualizada(servicio)}</p>
                      </div>
                      <div className="absolute top-4 left-4 text-5xl filter drop-shadow-lg">
                        {servicio.icon}
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-base font-bold text-[#3d2817] mb-3 leading-tight line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {getNombreActualizado(servicio)}
                      </h3>
                      
                      <div className="space-y-2 mb-4 flex-shrink-0">
                        <div className="flex items-center gap-2 text-xs text-stone-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-green-600 flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="truncate">Profesionales certificados</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-green-600 flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="truncate">Equipos de última tecnología</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-3 border-t border-stone-200">
                        <p className="text-xs text-stone-500 mb-1">Precio</p>
                        {(() => {
                          const precioInfo = getPrecioConDescuento(servicio);
                          if (precioInfo.tieneDescuento) {
                            return (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold text-stone-400 line-through">
                                  ${precioInfo.precioOriginal.toLocaleString()}
                                </span>
                                <span className="text-lg font-bold text-green-600 leading-tight">
                                  ${precioInfo.precioConDescuento.toLocaleString()}
                                </span>
                                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded">
                                  -{precioInfo.descuento}%
                                </span>
                              </div>
                            );
                          }
                          return (
                            <p className="text-lg font-bold text-amber-700 leading-tight">
                              ${precioInfo.precioOriginal.toLocaleString()}
                            </p>
                          );
                        })()}
                        <p className="text-xs text-stone-400 italic mt-2 text-center">Hover para ver más</p>
                      </div>
                    </div>
                  </div>

                  {/* REVERSO de la tarjeta */}
                  <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-[#3d2817] to-[#2d1f11] rounded-3xl shadow-xl overflow-hidden p-6 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                          Incluye:
                        </h3>
                        <span className="text-4xl">{servicio.icon}</span>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {servicio.detalles.map((detalle: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-white/90">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            <span className="text-sm">{detalle}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                        <div>
                          <p className="text-xs text-white/70">Duración</p>
                          <p className="text-lg font-bold text-white">{getDuracionActualizada(servicio)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-white/70">Precio</p>
                          {(() => {
                            const precioInfo = getPrecioConDescuento(servicio);
                            if (precioInfo.tieneDescuento) {
                              return (
                                <div className="flex flex-col items-end gap-1">
                                  <span className="text-sm font-semibold text-white/50 line-through">
                                    ${precioInfo.precioOriginal.toLocaleString()}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-amber-400">
                                      ${precioInfo.precioConDescuento.toLocaleString()}
                                    </span>
                                    <span className="text-xs font-semibold text-green-300 bg-green-500/30 px-2 py-0.5 rounded">
                                      -{precioInfo.descuento}%
                                    </span>
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <p className="text-lg font-bold text-amber-400">${precioInfo.precioOriginal.toLocaleString()}</p>
                            );
                          })()}
                        </div>
                      </div>

                      <button
                        onClick={() => handleReservar(servicio)}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        Reservar Ahora
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección informativa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-amber-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Horarios Flexibles
            </h3>
            <p className="text-sm text-stone-600">
              Jueves a Domingo<br />08:00 AM - 04:00 PM
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Calidad Garantizada
            </h3>
            <p className="text-sm text-stone-600">
              Protocolos certificados<br />y equipos profesionales
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Atención Personalizada
            </h3>
            <p className="text-sm text-stone-600">
              Cada tratamiento adaptado<br />a tus necesidades
            </p>
          </div>
        </div>

        {/* CTA final */}
        <div className="mt-16 text-center bg-gradient-to-br from-amber-100 to-stone-100 rounded-3xl p-8 md:p-12 shadow-xl">
          <h2 className="text-2xl md:text-3xl text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¿Listo para comenzar tu camino al bienestar?
          </h2>
          <p className="text-stone-600 mb-6 text-sm md:text-base max-w-2xl mx-auto">
            Reserva tu cita hoy y descubre la diferencia de recibir tratamientos de la más alta calidad en un ambiente profesional y relajante.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://wa.me/573014185239"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Contactar por WhatsApp
            </a>
            <Link
              href="/reservas"
              className="inline-block bg-[#3d2817] hover:bg-[#2d1f11] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Reservar en línea
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

        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </main>
  );
}
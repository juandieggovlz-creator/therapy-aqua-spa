"use client";

import { useState, useEffect } from 'react';

type ContenidoPublico = {
  logo?: {
    imagen: string;
    texto: string;
  };
  sobreNosotros?: {
    titulo: string;
    subtitulo: string;
    descripcion: string;
    mision: string;
    vision: string;
    valores: string[];
  };
  ubicacion?: {
    direccion: string;
    lugar: string;
    ciudad: string;
    mapaEmbed: string;
    mapaLink: string;
    parqueadero: boolean;
    acceso: string;
  };
  contacto?: {
    telefono: string;
    email: string;
    whatsapp: string;
    whatsappLink: string;
    horariosAtencion: string;
    mensajeContacto: string;
  };
  horarios?: {
    lunes: { abierto: boolean; apertura: string; cierre: string };
    martes: { abierto: boolean; apertura: string; cierre: string };
    miercoles: { abierto: boolean; apertura: string; cierre: string };
    jueves: { abierto: boolean; apertura: string; cierre: string };
    viernes: { abierto: boolean; apertura: string; cierre: string };
    sabado: { abierto: boolean; apertura: string; cierre: string };
    domingo: { abierto: boolean; apertura: string; cierre: string };
  };
  redesSociales?: {
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube: string;
    twitter: string;
  };
  banner?: {
    imagen: string;
    texto: string;
    textoBoton: string;
    mostrar: boolean;
  };
  secciones?: {
    promociones?: { mostrar: boolean; titulo: string };
    testimonios?: { mostrar: boolean; titulo: string };
    serviciosDestacados?: { mostrar: boolean; titulo: string };
  };
  anuncio?: {
    activo: boolean;
    etiqueta: string;
    titulo: string;
    descripcion: string;
    mostrarBoton: boolean;
    botonTexto: string;
    botonEnlace: string;
  };
  whatsapp?: {
    numero: string;
    mensaje: string;
    mostrar: boolean;
  };
  botones?: {
    reservar: string;
    verServicios: string;
    contactar: string;
    escribir: string;
  };
  mensajes?: {
    urgencia: string;
    campanas: string[];
  };
};

export function useCMS() {
  const [contenido, setContenido] = useState<ContenidoPublico | null>(null);
  const [loading, setLoading] = useState(true);

  const loadContenido = () => {
    fetch('/api/admin/cms')
      .then(res => res.json())
      .then(data => {
        setContenido(data.contenido);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadContenido();
  }, []);

  // Escuchar eventos de actualización de CMS
  useEffect(() => {
    const handleCmsActualizado = () => {
      console.log('📝 useCMS - CMS actualizado, recargando contenido...');
      setTimeout(() => {
        loadContenido();
      }, 500);
    };

    window.addEventListener('cmsActualizado', handleCmsActualizado);

    return () => {
      window.removeEventListener('cmsActualizado', handleCmsActualizado);
    };
  }, []);

  return { contenido, loading };
}








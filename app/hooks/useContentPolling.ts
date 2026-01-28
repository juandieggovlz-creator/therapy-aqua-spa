"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface ContentData {
  servicios?: any[];
  promociones?: any[];
  cms?: any;
  descuentos?: any;
  lastUpdated?: string;
  version?: number;
}

interface UseContentPollingOptions {
  section?: "servicios" | "promociones" | "cms" | "descuentos";
  intervalo?: number; // en milisegundos (default: 15000 = 15 segundos)
  onUpdate?: (nuevoContenido: ContentData) => void;
  enabled?: boolean; // para activar/desactivar el polling
}

/**
 * Hook personalizado para polling automático del contenido
 * Actualiza automáticamente el contenido cada X segundos
 */
export function useContentPolling(options: UseContentPollingOptions = {}) {
  const {
    section,
    intervalo = 15000, // 15 segundos por defecto
    onUpdate,
    enabled = true
  } = options;

  const [contenido, setContenido] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string | null>(null);
  
  // Refs para evitar re-renders innecesarios
  const versionActualRef = useRef<number>(0);
  const isPollingRef = useRef(false);

  // Función para cargar contenido
  const cargarContenido = useCallback(async (silencioso = false) => {
    if (!enabled) return;
    
    try {
      if (!silencioso) {
        setLoading(true);
      }
      setError(null);

      const url = section 
        ? `/api/content?section=${section}`
        : "/api/content";

      const response = await fetch(url, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache"
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Verificar si el contenido ha cambiado
      const nuevaVersion = data.version || 0;
      const contenidoCambio = nuevaVersion > versionActualRef.current;

      if (contenidoCambio || !contenido) {
        console.log(`🔄 Contenido actualizado (v${versionActualRef.current} → v${nuevaVersion})`);
        
        versionActualRef.current = nuevaVersion;
        setContenido(data);
        setUltimaActualizacion(data.lastUpdated || new Date().toISOString());

        // Callback personalizado
        if (onUpdate && contenidoCambio) {
          onUpdate(data);
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al cargar contenido";
      console.error("❌ Error en polling:", errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [section, enabled, onUpdate, contenido]);

  // Cargar contenido inicial
  useEffect(() => {
    if (enabled) {
      cargarContenido(false);
    }
  }, [enabled]); // Solo cuando enabled cambie

  // Iniciar polling
  useEffect(() => {
    if (!enabled) return;

    isPollingRef.current = true;

    const intervalId = setInterval(() => {
      if (isPollingRef.current) {
        cargarContenido(true); // Silencioso para no mostrar loading
      }
    }, intervalo);

    console.log(`✅ Polling iniciado (cada ${intervalo / 1000}s)`);

    // Cleanup
    return () => {
      isPollingRef.current = false;
      clearInterval(intervalId);
      console.log("🛑 Polling detenido");
    };
  }, [intervalo, enabled, cargarContenido]);

  // Función manual para recargar
  const recargar = useCallback(() => {
    return cargarContenido(false);
  }, [cargarContenido]);

  return {
    contenido,
    loading,
    error,
    ultimaActualizacion,
    recargar,
    version: versionActualRef.current
  };
}

/**
 * Hook simplificado solo para servicios
 */
export function useServiciosPolling(onUpdate?: (servicios: any[]) => void) {
  return useContentPolling({
    section: "servicios",
    onUpdate: (data) => {
      if (onUpdate && data.servicios) {
        onUpdate(data.servicios);
      }
    }
  });
}

/**
 * Hook simplificado solo para promociones
 */
export function usePromocionesPolling(onUpdate?: (promociones: any[]) => void) {
  return useContentPolling({
    section: "promociones",
    onUpdate: (data) => {
      if (onUpdate && data.promociones) {
        onUpdate(data.promociones);
      }
    }
  });
}

/**
 * Hook simplificado solo para CMS
 */
export function useCMSPolling(onUpdate?: (cms: any) => void) {
  return useContentPolling({
    section: "cms",
    onUpdate: (data) => {
      if (onUpdate && data.cms) {
        onUpdate(data.cms);
      }
    }
  });
}






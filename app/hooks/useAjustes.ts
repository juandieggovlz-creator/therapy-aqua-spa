"use client";

import { useState, useEffect } from 'react';

type Ajustes = {
  moneda: {
    codigo: string;
    simbolo: string;
    nombre: string;
  };
  impuestos: {
    iva: number;
    otros: number;
  };
  horarios: {
    [key: string]: { abierto: boolean; inicio: string; fin: string };
  };
  contacto: {
    telefono: string;
    email: string;
    direccion: string;
    whatsapp: string;
  };
  redesSociales: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
};

export function useAjustes() {
  const [ajustes, setAjustes] = useState<Ajustes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/ajustes')
      .then(res => res.json())
      .then(data => {
        setAjustes(data.ajustes);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return { ajustes, loading };
}

















export const runtime = "nodejs";
import { NextResponse } from "next/server";

// Ajustes globales del negocio
let ajustes = {
  moneda: {
    codigo: 'COP',
    simbolo: '$',
    nombre: 'Peso Colombiano'
  },
  impuestos: {
    iva: 0, // porcentaje
    otros: 0
  },
  horarios: {
    lunes: { abierto: false, inicio: '', fin: '' },
    martes: { abierto: false, inicio: '', fin: '' },
    miercoles: { abierto: false, inicio: '', fin: '' },
    jueves: { abierto: true, inicio: '08:00', fin: '16:00' },
    viernes: { abierto: true, inicio: '08:00', fin: '16:00' },
    sabado: { abierto: true, inicio: '08:00', fin: '16:00' },
    domingo: { abierto: true, inicio: '08:00', fin: '16:00' }
  },
  contacto: {
    telefono: '+57 301 4185239',
    email: 'info@therapyaquaspa.com',
    direccion: 'Calle 138 Nro. 55-38, Bogotá, Colombia',
    whatsapp: '+573014185239'
  },
  redesSociales: {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: ''
  }
};

export async function GET() {
  try {
    return NextResponse.json({ ajustes }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Error al obtener ajustes" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    // Actualizar ajustes de forma recursiva
    const actualizarAjustes = (obj: any, updates: any) => {
      for (const key in updates) {
        if (typeof updates[key] === 'object' && !Array.isArray(updates[key]) && updates[key] !== null) {
          if (!obj[key]) obj[key] = {};
          actualizarAjustes(obj[key], updates[key]);
        } else {
          obj[key] = updates[key];
        }
      }
    };

    actualizarAjustes(ajustes, body);

    return NextResponse.json(
      { success: true, ajustes },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Error al actualizar ajustes" },
      { status: 500 }
    );
  }
}







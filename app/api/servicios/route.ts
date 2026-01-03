import { NextResponse } from "next/server";

// Servicios desde la base de datos (en producción vendría de BD)
const servicios = [
  { id: 'columna', nombre: 'THERAPY LESIONES DE COLUMNA', precio: 100000, icon: '🦴' },
  { id: 'brazos', nombre: 'THERAPY LESIONES MUSCULARES BRAZOS', precio: 60000, icon: '💪' },
  { id: 'piernas', nombre: 'THERAPY LESIONES MUSCULARES PIERNAS', precio: 60000, icon: '🦵' },
  { id: 'hombro', nombre: 'THERAPY TRAUMA HOMBRO, CODO, MUÑECA', precio: 250000, icon: '🤝' },
  { id: 'cadera', nombre: 'THERAPY TRAUMA CADERA, RODILLA, TOBILLO', precio: 250000, icon: '🦿' },
  { id: 'mano', nombre: 'SKINCARE MANO THERAPY', precio: 90000, icon: '🤲' },
  { id: 'ocular', nombre: 'PRESO THERAPY OCULAR', precio: 80000, icon: '👁️' },
  { id: 'bienestar', nombre: 'MASAJE BIENESTAR GENERAL', precio: 140000, icon: '🌿' },
  { id: 'facial', nombre: 'MASAJE FACIAL', precio: 90000, icon: '✨' },
  { id: 'espalda', nombre: 'MASAJE DE ESPALDA', precio: 120000, icon: '🧘' },
  { id: 'hombros', nombre: 'MASAJE HOMBROS Y BRAZOS', precio: 100000, icon: '💆' },
  { id: 'rodillas', nombre: 'MASAJE CADERAS Y RODILLAS', precio: 120000, icon: '🦴' },
  { id: 'pies', nombre: 'MASAJE PANTORRILLAS Y PIES', precio: 120000, icon: '🦶' },
  { id: 'deportivo', nombre: 'MASAJE THERAPY DEPORTIVO', precio: 100000, icon: '🏃' },
];

export async function GET(request: Request) {
  try {
    const baseUrl = request.headers.get('host') 
      ? `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host')}`
      : 'http://localhost:3000';

    // Obtener precios, descuentos y promoción
    const [preciosRes, descuentosRes, promocionRes] = await Promise.all([
      fetch(`${baseUrl}/api/admin/precios`).catch(() => null),
      fetch(`${baseUrl}/api/admin/descuentos`).catch(() => null),
      fetch(`${baseUrl}/api/admin/promociones`).catch(() => null),
    ]);

    const preciosData = preciosRes ? await preciosRes.json() : { precios: {} };
    const descuentosData = descuentosRes ? await descuentosRes.json() : { descuentos: {} };
    const promocionData = promocionRes ? await promocionRes.json() : { promocion: null };

    const precios = preciosData.precios || {};
    const descuentos = descuentosData.descuentos || {};
    const promocion = promocionData.promocion || null;

    // Combinar servicios con precios y descuentos
    const serviciosConPrecios = servicios.map(servicio => ({
      ...servicio,
      precio: precios[servicio.id] || servicio.precio,
      descuento: descuentos[servicio.id] || null,
      promocionActiva: promocion?.activa || false,
      descuentoPromocion: promocion?.activa ? promocion.descuento : 0,
    }));

    return NextResponse.json({ servicios: serviciosConPrecios, promocion }, { status: 200 });
  } catch (e) {
    // Si hay error, devolver servicios base
    return NextResponse.json({ servicios, promocion: null }, { status: 200 });
  }
}

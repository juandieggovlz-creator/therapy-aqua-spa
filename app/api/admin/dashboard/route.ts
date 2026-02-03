export const runtime = "nodejs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Definir rangos de tiempo
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const inicioSemana = new Date(hoy);
    const diaSemana = hoy.getDay();
    const diasDesdeLunes = diaSemana === 0 ? 6 : diaSemana - 1;
    inicioSemana.setDate(hoy.getDate() - diasDesdeLunes);

    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    // Contar reservas por rangos usando Prisma
    // Consideramos todas las reservas creadas en esos rangos
    const [hoyCount, semanaCount, mesCount] = await Promise.all([
      prisma.reserva.count({
        where: { created_at: { gte: hoy } }
      }),
      prisma.reserva.count({
        where: { created_at: { gte: inicioSemana } }
      }),
      prisma.reserva.count({
        where: { created_at: { gte: inicioMes } }
      })
    ]);

    console.log(`📊 DASHBOARD - Hoy: ${hoyCount}, Semana: ${semanaCount}, Mes: ${mesCount}`);

    return NextResponse.json({
      reservas: {
        hoy: hoyCount,
        semana: semanaCount,
        mes: mesCount,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ ERROR EN DASHBOARD:", error);
    return NextResponse.json({
      reservas: {
        hoy: 0,
        semana: 0,
        mes: 0,
      }
    }, { status: 200 });
  }
}

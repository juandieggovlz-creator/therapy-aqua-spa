import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const RESERVAS_PATH = path.join(process.cwd(), "data", "reservas.json");

// Leer reservas del archivo JSON
function leerReservas() {
  try {
    const fileContent = fs.readFileSync(RESERVAS_PATH, "utf-8");
    const data = JSON.parse(fileContent);
    return data.reservas || [];
  } catch (error) {
    console.error("❌ Error leyendo reservas.json:", error);
    return [];
  }
}

export async function GET() {
  try {
    const BOOKINGS = leerReservas();
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 DASHBOARD - Obteniendo datos');
    console.log(`📦 Total reservas en BOOKINGS: ${BOOKINGS.length}`);
    
    // Si no hay reservas, retornar ceros
    if (!BOOKINGS || BOOKINGS.length === 0) {
      console.log('⚠️ No hay reservas - Retornando ceros');
      return NextResponse.json({
        reservas: {
          hoy: 0,
          semana: 0,
          mes: 0,
        }
      }, { status: 200 });
    }
    
    // Fecha de hoy (solo año, mes, día)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const hoyStr = hoy.toISOString().split('T')[0]; // YYYY-MM-DD
    const hoyTimestamp = hoy.getTime();
    
    // Inicio de la semana (lunes)
    const inicioSemana = new Date(hoy);
    const diaSemana = hoy.getDay();
    const diasDesdeLunes = diaSemana === 0 ? 6 : diaSemana - 1;
    inicioSemana.setDate(hoy.getDate() - diasDesdeLunes);
    inicioSemana.setHours(0, 0, 0, 0);
    const inicioSemanaTimestamp = inicioSemana.getTime();
    
    // Inicio del mes (día 1)
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    inicioMes.setHours(0, 0, 0, 0);
    const inicioMesTimestamp = inicioMes.getTime();
    
    console.log(`📅 Fecha HOY: ${hoyStr} (timestamp: ${hoyTimestamp})`);
    console.log(`📅 Inicio SEMANA: ${inicioSemana.toISOString().split('T')[0]} (timestamp: ${inicioSemanaTimestamp})`);
    console.log(`📅 Inicio MES: ${inicioMes.toISOString().split('T')[0]} (timestamp: ${inicioMesTimestamp})`);
    
    // Contar reservas
    let reservasHoy = 0;
    let reservasSemana = 0;
    let reservasMes = 0;
    
    // Fecha de hoy en ISO para asignar a reservas sin createdAt
    const fechaHoyISO = new Date().toISOString();
    
    BOOKINGS.forEach((reserva: any, index: number) => {
      if (!reserva || !reserva.id) {
        console.log(`⚠️ Reserva en índice ${index} es inválida`);
        return;
      }
      
      // Obtener createdAt de la reserva
      let createdAt: string = reserva.createdAt || '';
      
      console.log(`\n🔍 [${index + 1}/${BOOKINGS.length}] Reserva: ${reserva.id}`);
      console.log(`   Cliente: ${reserva.cliente || reserva.nombre || 'Sin nombre'}`);
      console.log(`   createdAt original: ${createdAt || 'VACÍO'}`);
      
      // Si no tiene createdAt, asignarle HOY y contarla
      if (!createdAt || createdAt === '' || createdAt === null || createdAt === undefined) {
        createdAt = fechaHoyISO;
        reserva.createdAt = createdAt;
        reservasHoy++;
        reservasSemana++;
        reservasMes++;
        console.log(`   ✅ SIN createdAt - ASIGNADO HOY Y CONTADA (Hoy: ${reservasHoy})`);
        return;
      }
      
      // Parsear la fecha
      try {
        const fechaReserva = new Date(createdAt);
        
        // Si la fecha es inválida, asignar HOY y contar
        if (isNaN(fechaReserva.getTime())) {
          createdAt = fechaHoyISO;
          reserva.createdAt = createdAt;
          reservasHoy++;
          reservasSemana++;
          reservasMes++;
          console.log(`   ✅ FECHA INVÁLIDA (NaN) - ASIGNADO HOY Y CONTADA (Hoy: ${reservasHoy})`);
          return;
        }
        
        // Normalizar la fecha (solo año, mes, día)
        fechaReserva.setHours(0, 0, 0, 0);
        const fechaReservaTimestamp = fechaReserva.getTime();
        const fechaReservaStr = fechaReserva.toISOString().split('T')[0];
        
        console.log(`   Fecha parseada: ${fechaReservaStr} (timestamp: ${fechaReservaTimestamp})`);
        console.log(`   Comparando: ${fechaReservaTimestamp} === ${hoyTimestamp} ?`);
        
        // Comparar con HOY
        if (fechaReservaTimestamp === hoyTimestamp) {
          reservasHoy++;
          console.log(`   ✅✅✅ ES DE HOY - CONTADA (Hoy: ${reservasHoy})`);
        } else {
          console.log(`   ❌ NO es de HOY (diferencia: ${hoyTimestamp - fechaReservaTimestamp})`);
        }
        
        // Comparar con SEMANA
        if (fechaReservaTimestamp >= inicioSemanaTimestamp) {
          reservasSemana++;
          console.log(`   ✅ Es de esta SEMANA (Semana: ${reservasSemana})`);
        }
        
        // Comparar con MES
        if (fechaReservaTimestamp >= inicioMesTimestamp) {
          reservasMes++;
          console.log(`   ✅ Es de este MES (Mes: ${reservasMes})`);
        }
      } catch (error: any) {
        // Error al parsear, asignar HOY y contar
        createdAt = fechaHoyISO;
        reserva.createdAt = createdAt;
        reservasHoy++;
        reservasSemana++;
        reservasMes++;
        console.log(`   ✅ ERROR AL PARSEAR - ASIGNADO HOY Y CONTADA (Hoy: ${reservasHoy}): ${error.message}`);
      }
    });
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`📊 RESULTADOS FINALES:`);
    console.log(`   📦 Total reservas: ${BOOKINGS.length}`);
    console.log(`   ✅ Reservas HOY: ${reservasHoy}`);
    console.log(`   ✅ Reservas SEMANA: ${reservasSemana}`);
    console.log(`   ✅ Reservas MES: ${reservasMes}`);
    console.log('═══════════════════════════════════════════════════════════\n');
    
    return NextResponse.json({
      reservas: {
        hoy: reservasHoy,
        semana: reservasSemana,
        mes: reservasMes,
      }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("❌ ERROR EN DASHBOARD:", error);
    console.error("Stack:", error?.stack);
    return NextResponse.json({
      reservas: {
        hoy: 0,
        semana: 0,
        mes: 0,
      }
    }, { status: 200 });
  }
}

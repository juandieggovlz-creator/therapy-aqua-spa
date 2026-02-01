import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener todos los servicios
export async function GET() {
  try {
    // Usar query raw para evitar problemas con Prisma client
    const servicios: any[] = await prisma.$queryRaw`
      SELECT *
      FROM servicios
      ORDER BY created_at DESC
    `;

    // Convertir Decimal a number para el frontend y mapear IDs
    const serviciosFormateados = servicios.map((s: any) => {
      // Procesar la ruta de la imagen
      let imagenUrl = s.imagen || '';
      if (imagenUrl) {
        if (imagenUrl.startsWith('http')) {
          // URL externa, dejar como está
          imagenUrl = imagenUrl;
        } else if (imagenUrl.startsWith('/image/')) {
          // Ya tiene la ruta, dejar como está
          imagenUrl = imagenUrl;
        } else if (imagenUrl.startsWith('/')) {
          // Tiene /, pero no /image/, dejar como está
          imagenUrl = imagenUrl;
        } else {
          // Solo nombre de archivo, agregar /image/ y codificar
          imagenUrl = `/image/${encodeURIComponent(imagenUrl)}`;
        }
      }
      
      return {
        ...s,
        id: s.servicio_id, // Usar servicio_id como id para el frontend
        imagen: imagenUrl,
        precio: Number(s.precio),
        descuento: 0, // Campo no existe aún en la DB
        destacado: false // Campo no existe aún en la DB
      };
    });

    return NextResponse.json({ 
      servicios: serviciosFormateados,
      success: true 
    });
  } catch (error) {
    console.error('❌ Error obteniendo servicios:', error);
    return NextResponse.json(
      { error: 'Error al obtener servicios' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo servicio
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('📝 Creando servicio con datos:', body);
    
    // Usar el ID proporcionado o generar uno automático
    let servicioId = body.id || body.servicio_id;
    if (!servicioId) {
      servicioId = `srv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      console.log('🆔 ID generado automáticamente:', servicioId);
    }
    
    // Verificar si ya existe
    const existe: any[] = await prisma.$queryRaw`
      SELECT servicio_id FROM servicios WHERE servicio_id = ${servicioId}
    `;
    
    if (existe.length > 0) {
      return NextResponse.json(
        { error: `Ya existe un servicio con el ID "${servicioId}"` },
        { status: 400 }
      );
    }
    
    // Procesar la imagen para asegurar formato correcto
    let imagenFinal = body.imagen || '';
    if (imagenFinal && !imagenFinal.startsWith('http') && !imagenFinal.startsWith('/image/')) {
      // Si es solo un nombre de archivo, agregar la ruta /image/
      imagenFinal = `/image/${encodeURIComponent(imagenFinal)}`;
    }
    
    // Procesar detalles (debe ser un array)
    let detallesArray = [];
    if (body.detalles) {
      if (Array.isArray(body.detalles)) {
        detallesArray = body.detalles;
      } else if (typeof body.detalles === 'string') {
        detallesArray = [body.detalles];
      }
    }
    // Si no hay detalles, crear uno básico con la descripción
    if (detallesArray.length === 0 && body.descripcion) {
      detallesArray = [body.descripcion];
    }
    
    // Usar query raw para insertar
    await prisma.$executeRaw`
      INSERT INTO servicios (servicio_id, nombre, descripcion, categoria, precio, duracion, icon, imagen, activo, orden, detalles, created_at, updated_at)
      VALUES (
        ${servicioId},
        ${body.nombre},
        ${body.descripcion || ''},
        ${body.categoria || 'Tratamientos de Bienestar'},
        ${body.precio},
        ${body.duracion || 30},
        ${body.icon || '💆'},
        ${imagenFinal},
        ${body.activo !== undefined ? body.activo : true},
        ${body.orden || 0},
        ${JSON.stringify(detallesArray)}::jsonb,
        NOW(),
        NOW()
      )
    `;

    console.log('✅ Servicio creado exitosamente:', servicioId);

    return NextResponse.json({ 
      servicio: {
        id: servicioId,
        servicio_id: servicioId,
        nombre: body.nombre,
        precio: Number(body.precio),
        descuento: 0,
        destacado: false
      },
      success: true 
    });
  } catch (error) {
    console.error('❌ Error creando servicio:', error);
    return NextResponse.json(
      { error: 'Error al crear servicio' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar servicio existente
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, descuento, destacado, ...updates } = body;

    console.log('📝 Actualizando servicio:', id, 'con datos:', updates);

    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      );
    }

    // Procesar la imagen para asegurar formato correcto
    let imagenFinal = updates.imagen;
    if (imagenFinal && !imagenFinal.startsWith('http') && !imagenFinal.startsWith('/image/')) {
      imagenFinal = `/image/${encodeURIComponent(imagenFinal)}`;
    }

    // Procesar detalles (debe ser un array)
    let detallesArray = null;
    if (updates.detalles !== undefined) {
      if (Array.isArray(updates.detalles)) {
        detallesArray = updates.detalles;
      } else if (typeof updates.detalles === 'string') {
        detallesArray = [updates.detalles];
      } else {
        detallesArray = [];
      }
    }

    // Usar query raw para actualizar con prepared statements para seguridad
    await prisma.$executeRaw`
      UPDATE servicios
      SET 
        nombre = ${updates.nombre !== undefined ? updates.nombre : 'Servicio'},
        descripcion = ${updates.descripcion !== undefined ? updates.descripcion : ''},
        categoria = ${updates.categoria !== undefined ? updates.categoria : 'Tratamientos de Bienestar'},
        precio = ${updates.precio !== undefined ? Number(updates.precio) : 0},
        duracion = ${updates.duracion !== undefined ? Number(updates.duracion) : 30},
        icon = ${updates.icon !== undefined ? updates.icon : '💆'},
        imagen = ${imagenFinal || ''},
        activo = ${updates.activo !== undefined ? updates.activo : true},
        orden = ${updates.orden !== undefined ? Number(updates.orden) : 0},
        detalles = ${detallesArray !== null ? JSON.stringify(detallesArray) : null}::jsonb,
        updated_at = NOW()
      WHERE servicio_id = ${id}
    `;

    console.log('✅ Servicio actualizado exitosamente:', id);

    // Obtener el servicio actualizado
    const serviciosActualizados: any[] = await prisma.$queryRaw`
      SELECT * FROM servicios WHERE servicio_id = ${id}
    `;

    const servicioActualizado = serviciosActualizados[0];

    return NextResponse.json({ 
      servicio: {
        id: servicioActualizado.servicio_id,
        servicio_id: servicioActualizado.servicio_id,
        nombre: servicioActualizado.nombre,
        descripcion: servicioActualizado.descripcion,
        categoria: servicioActualizado.categoria,
        precio: Number(servicioActualizado.precio),
        duracion: servicioActualizado.duracion,
        icon: servicioActualizado.icon,
        imagen: servicioActualizado.imagen,
        activo: servicioActualizado.activo,
        orden: servicioActualizado.orden,
        detalles: servicioActualizado.detalles
      },
      success: true 
    });
  } catch (error) {
    console.error('❌ Error actualizando servicio:', error);
    return NextResponse.json(
      { error: 'Error al actualizar servicio' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar servicio
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      );
    }

    // Usar query raw para eliminar
    await prisma.$executeRaw`
      DELETE FROM servicios 
      WHERE servicio_id = ${id}
    `;

    console.log('✅ Servicio eliminado:', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error eliminando servicio:', error);
    return NextResponse.json(
      { error: 'Error al eliminar servicio' },
      { status: 500 }
    );
  }
}


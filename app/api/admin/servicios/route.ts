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
    
    // Generar servicio_id único
    const servicioId = `srv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Procesar la imagen para asegurar formato correcto
    let imagenFinal = body.imagen || '';
    if (imagenFinal && !imagenFinal.startsWith('http') && !imagenFinal.startsWith('/image/')) {
      // Si es solo un nombre de archivo, agregar la ruta /image/
      imagenFinal = `/image/${encodeURIComponent(imagenFinal)}`;
    }
    
    // Usar query raw para insertar
    await prisma.$executeRaw`
      INSERT INTO servicios (servicio_id, nombre, descripcion, categoria, precio, duracion, icon, imagen, activo, orden, detalles, created_at, updated_at)
      VALUES (
        ${servicioId},
        ${body.nombre},
        ${body.descripcion || ''},
        ${body.categoria || 'General'},
        ${body.precio},
        ${body.duracion || 30},
        ${body.icon || '💆'},
        ${imagenFinal},
        ${body.activo !== undefined ? body.activo : true},
        ${body.orden || 0},
        ${body.detalles ? JSON.stringify(body.detalles) : null}::jsonb,
        NOW(),
        NOW()
      )
    `;

    console.log('✅ Servicio creado:', servicioId);

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

    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      );
    }

    // Filtrar solo los campos que existen en la DB
    const validUpdates: any = {};
    if (updates.nombre !== undefined) validUpdates.nombre = updates.nombre;
    if (updates.descripcion !== undefined) validUpdates.descripcion = updates.descripcion;
    if (updates.categoria !== undefined) validUpdates.categoria = updates.categoria;
    if (updates.precio !== undefined) validUpdates.precio = updates.precio;
    if (updates.duracion !== undefined) validUpdates.duracion = updates.duracion;
    if (updates.icon !== undefined) validUpdates.icon = updates.icon;
    if (updates.imagen !== undefined) {
      // Procesar la imagen para asegurar formato correcto
      let imagenFinal = updates.imagen;
      if (imagenFinal && !imagenFinal.startsWith('http') && !imagenFinal.startsWith('/image/')) {
        imagenFinal = `/image/${encodeURIComponent(imagenFinal)}`;
      }
      validUpdates.imagen = imagenFinal;
    }
    if (updates.activo !== undefined) validUpdates.activo = updates.activo;
    if (updates.orden !== undefined) validUpdates.orden = updates.orden;
    if (updates.detalles !== undefined) validUpdates.detalles = updates.detalles;

    // Usar query raw para actualizar
    if (Object.keys(validUpdates).length > 0) {
      // Construir el query SQL manualmente
      const setStatements: string[] = [];
      if (validUpdates.nombre) setStatements.push(`nombre = '${validUpdates.nombre.replace(/'/g, "''")}'`);
      if (validUpdates.descripcion !== undefined) setStatements.push(`descripcion = '${(validUpdates.descripcion || '').replace(/'/g, "''")}'`);
      if (validUpdates.categoria) setStatements.push(`categoria = '${validUpdates.categoria.replace(/'/g, "''")}'`);
      if (validUpdates.precio) setStatements.push(`precio = ${validUpdates.precio}`);
      if (validUpdates.duracion) setStatements.push(`duracion = ${validUpdates.duracion}`);
      if (validUpdates.icon) setStatements.push(`icon = '${validUpdates.icon.replace(/'/g, "''")}'`);
      if (validUpdates.imagen !== undefined) setStatements.push(`imagen = '${(validUpdates.imagen || '').replace(/'/g, "''")}'`);
      if (validUpdates.activo !== undefined) setStatements.push(`activo = ${validUpdates.activo}`);
      if (validUpdates.orden !== undefined) setStatements.push(`orden = ${validUpdates.orden}`);
      if (validUpdates.detalles !== undefined) setStatements.push(`detalles = '${JSON.stringify(validUpdates.detalles).replace(/'/g, "''")}'::jsonb`);
      
      setStatements.push(`updated_at = NOW()`);
      
      const query = `UPDATE servicios SET ${setStatements.join(', ')} WHERE servicio_id = '${id}'`;
      await prisma.$executeRawUnsafe(query);
    }

    console.log('✅ Servicio actualizado:', id);

    return NextResponse.json({ 
      servicio: {
        id: id,
        servicio_id: id,
        ...validUpdates,
        precio: validUpdates.precio ? Number(validUpdates.precio) : undefined,
        descuento: 0,
        destacado: false
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


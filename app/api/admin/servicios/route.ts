import { NextResponse } from "next/server";
import { leerContenido, escribirContenido } from "@/lib/content-helpers";

// GET - Obtener todos los servicios
export async function GET() {
  try {
    const content = await leerContenido();
    return NextResponse.json({ servicios: content.servicios }, { status: 200 });
  } catch (error) {
    console.error("Error leyendo servicios:", error);
    return NextResponse.json(
      { error: "Error al leer servicios" },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo servicio
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const content = await leerContenido();

    // Validar campos requeridos
    if (!body.id || !body.nombre) {
      return NextResponse.json(
        { error: "ID y nombre son requeridos" },
        { status: 400 }
      );
    }

    // Verificar que el ID no exista
    const existe = content.servicios.find((s: any) => s.id === body.id);
    if (existe) {
      return NextResponse.json(
        { error: "Ya existe un servicio con ese ID" },
        { status: 400 }
      );
    }

    // Crear nuevo servicio con valores por defecto
    const nuevoServicio = {
      id: body.id,
      nombre: body.nombre,
      precio: body.precio || 0,
      precioOriginal: body.precioOriginal || body.precio || 0,
      duracion: body.duracion || 30,
      descripcion: body.descripcion || "",
      imagen: body.imagen || "",
      icon: body.icon || "✨",
      activo: body.activo !== undefined ? body.activo : true,
      destacado: body.destacado || false,
      categoria: body.categoria || "General",
      orden: body.orden || content.servicios.length + 1,
    };

    content.servicios.push(nuevoServicio);
    
    if (!(await escribirContenido(content))) {
      return NextResponse.json(
        { error: "Error al guardar servicio" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, servicio: nuevoServicio },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creando servicio:", error);
    return NextResponse.json(
      { error: "Error al crear servicio" },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar servicio existente
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const content = await leerContenido();

    if (!body.id) {
      return NextResponse.json(
        { error: "ID es requerido" },
        { status: 400 }
      );
    }

    const index = content.servicios.findIndex((s: any) => s.id === body.id);
    if (index === -1) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar solo los campos proporcionados
    const servicioActualizado = {
      ...content.servicios[index],
      ...body,
    };

    // Asegurar sincronización de precio y precioOriginal
    if (body.precio !== undefined && body.precioOriginal === undefined) {
      servicioActualizado.precioOriginal = body.precio;
    }

    console.log(`✏️ Actualizando servicio ${body.id}: precio=${servicioActualizado.precio}, precioOriginal=${servicioActualizado.precioOriginal}`);

    content.servicios[index] = servicioActualizado;
    
    if (!(await escribirContenido(content))) {
      return NextResponse.json(
        { error: "Error al actualizar servicio" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, servicio: servicioActualizado },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error actualizando servicio:", error);
    return NextResponse.json(
      { error: "Error al actualizar servicio" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar servicio
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 });
    }

    const content = await leerContenido();
    const index = content.servicios.findIndex((s: any) => s.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    content.servicios.splice(index, 1);
    
    if (!(await escribirContenido(content))) {
      return NextResponse.json(
        { error: "Error al eliminar servicio" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error eliminando servicio:", error);
    return NextResponse.json(
      { error: "Error al eliminar servicio" },
      { status: 500 }
    );
  }
}

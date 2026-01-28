import { NextResponse } from "next/server";
import { leerContenido, escribirContenido } from "@/lib/content-helpers";

/**
 * GET /api/admin/productos
 * Obtener todos los productos adicionales
 */
export async function GET() {
  try {
    const content = await leerContenido();
    
    if (!content) {
      return NextResponse.json(
        { error: "Error al leer datos" },
        { status: 500 }
      );
    }
    
    const productos = content.productos || [];
    
    return NextResponse.json(
      { productos },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en GET /api/admin/productos:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/productos
 * Crear o actualizar producto
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const content = await leerContenido();
    
    if (!content) {
      return NextResponse.json(
        { error: "Error al leer datos" },
        { status: 500 }
      );
    }
    
    if (!content.productos) {
      content.productos = [];
    }
    
    // Validar campos requeridos
    if (!body.nombre || body.precio === undefined) {
      return NextResponse.json(
        { error: "Nombre y precio son requeridos" },
        { status: 400 }
      );
    }
    
    if (body.id) {
      // Actualizar producto existente
      const index = content.productos.findIndex((p: any) => p.id === body.id);
      
      if (index === -1) {
        return NextResponse.json(
          { error: "Producto no encontrado" },
          { status: 404 }
        );
      }
      
      content.productos[index] = {
        ...content.productos[index],
        ...body
      };
      
      console.log(`✏️ Producto actualizado: ${body.nombre}`);
    } else {
      // Crear nuevo producto
      const nuevoProducto = {
        id: body.id || `producto-${Date.now()}`,
        nombre: body.nombre,
        precio: body.precio,
        icon: body.icon || '📦',
        activo: body.activo !== undefined ? body.activo : true,
        orden: body.orden || content.productos.length + 1
      };
      
      content.productos.push(nuevoProducto);
      console.log(`➕ Nuevo producto creado: ${nuevoProducto.nombre}`);
    }
    
    const exito = await escribirContenido(content);
    
    if (!exito) {
      return NextResponse.json(
        { error: "Error al guardar producto" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true,
        productos: content.productos
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST /api/admin/productos:", error);
    return NextResponse.json(
      { error: "Error al guardar producto" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/productos
 * Eliminar producto
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID es requerido" },
        { status: 400 }
      );
    }
    
    const content = await leerContenido();
    
    if (!content) {
      return NextResponse.json(
        { error: "Error al leer datos" },
        { status: 500 }
      );
    }
    
    if (!content.productos) {
      return NextResponse.json(
        { error: "No hay productos" },
        { status: 404 }
      );
    }
    
    const index = content.productos.findIndex((p: any) => p.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
    
    const productoEliminado = content.productos[index];
    content.productos.splice(index, 1);
    
    const exito = await escribirContenido(content);
    
    if (!exito) {
      return NextResponse.json(
        { error: "Error al eliminar producto" },
        { status: 500 }
      );
    }
    
    console.log(`🗑️ Producto eliminado: ${productoEliminado.nombre}`);
    
    return NextResponse.json(
      { 
        success: true,
        productos: content.productos
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en DELETE /api/admin/productos:", error);
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}




export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { CLIENTES, Cliente } from "./data";

// GET - Obtener todos los clientes
export async function GET() {
  try {
    console.log(`📋 API Clientes GET - Total clientes en CLIENTES: ${CLIENTES.length}`);

    // Ordenar por fecha de registro (más recientes primero)
    const clientesOrdenados = [...CLIENTES].sort((a, b) =>
      new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
    );

    console.log(`📋 API Clientes GET - Retornando ${clientesOrdenados.length} clientes ordenados`);
    if (clientesOrdenados.length > 0) {
      console.log(`   Primer cliente: ${clientesOrdenados[0].nombre} (${clientesOrdenados[0].telefono})`);
    }

    return NextResponse.json({ clientes: clientesOrdenados }, { status: 200 });
  } catch (e) {
    console.error('❌ Error en GET /api/clientes:', e);
    return NextResponse.json(
      { error: "Error al obtener clientes" },
      { status: 500 }
    );
  }
}

// POST - Crear o actualizar cliente
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, telefono, email, notas } = body;

    if (!nombre || !telefono) {
      return NextResponse.json(
        { error: "Nombre y teléfono son requeridos" },
        { status: 400 }
      );
    }

    // Normalizar teléfono (eliminar espacios, guiones, etc.)
    const telefonoNormalizado = telefono.replace(/\s+/g, '').replace(/-/g, '');

    // Verificar si el cliente ya existe por teléfono o email
    const clienteExistente = CLIENTES.find(
      c => c.telefono === telefonoNormalizado || (email && c.email === email)
    );

    if (clienteExistente) {
      // Actualizar cliente existente
      clienteExistente.nombre = nombre;
      if (email) clienteExistente.email = email;
      if (notas) clienteExistente.notas = notas;

      return NextResponse.json(
        { success: true, cliente: clienteExistente, message: "Cliente actualizado" },
        { status: 200 }
      );
    }

    // Crear nuevo cliente
    const nuevoCliente: Cliente = {
      id: `cliente-${Date.now()}`,
      nombre,
      telefono: telefonoNormalizado,
      email: email || '',
      fechaRegistro: new Date().toISOString(),
      totalReservas: 0,
      notas: notas || ''
    };

    CLIENTES.push(nuevoCliente);

    return NextResponse.json(
      { success: true, cliente: nuevoCliente, message: "Cliente creado" },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Error al crear cliente" },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar cliente
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID de cliente requerido" },
        { status: 400 }
      );
    }

    const index = CLIENTES.findIndex(c => c.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    // Normalizar teléfono si se actualiza
    if (updates.telefono) {
      updates.telefono = updates.telefono.replace(/\s+/g, '').replace(/-/g, '');
    }

    CLIENTES[index] = { ...CLIENTES[index], ...updates };

    return NextResponse.json(
      { success: true, cliente: CLIENTES[index] },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Error al actualizar cliente" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar cliente
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "ID de cliente requerido" },
        { status: 400 }
      );
    }

    const index = CLIENTES.findIndex(c => c.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    CLIENTES.splice(index, 1);

    return NextResponse.json(
      { success: true, message: "Cliente eliminado" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Error al eliminar cliente" },
      { status: 500 }
    );
  }
}




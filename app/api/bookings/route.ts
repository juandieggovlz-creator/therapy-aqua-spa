import { NextResponse } from "next/server";

// Datos de ejemplo de citas (en producción vendría de BD)
const BOOKINGS = [
  {
    id: "1",
    cliente: "María González",
    telefono: "+57 300 123 4567",
    email: "maria@example.com",
    servicio: "Masaje Bienestar General",
    servicioId: "bienestar",
    fisio: "Dra. Carolina Trujillo",
    fecha: "2024-01-20",
    hora: "10:00",
    duracion: 45,
    precio: 140000,
    estado: "confirmada",
    esAfiliado: false,
    serviciosAdicionales: ["Sauna"],
    productos: [],
    notas: "Cliente prefiere presión media",
    createdAt: "2024-01-15T08:00:00Z"
  },
  {
    id: "2",
    cliente: "Carlos Ruiz",
    telefono: "+57 301 234 5678",
    email: "carlos@example.com",
    servicio: "Therapy Lesiones de Columna",
    servicioId: "columna",
    fisio: "Dra. Carolina Trujillo",
    fecha: "2024-01-20",
    hora: "11:30",
    duracion: 30,
    precio: 100000,
    estado: "pendiente",
    esAfiliado: true,
    serviciosAdicionales: [],
    productos: [],
    notas: "",
    createdAt: "2024-01-16T10:30:00Z"
  },
  {
    id: "3",
    cliente: "Ana Martínez",
    telefono: "+57 302 345 6789",
    email: "ana@example.com",
    servicio: "Masaje Facial",
    servicioId: "facial",
    fisio: "Dra. Carolina Trujillo",
    fecha: "2024-01-20",
    hora: "14:00",
    duracion: 30,
    precio: 90000,
    estado: "confirmada",
    esAfiliado: false,
    serviciosAdicionales: ["Jacuzzi"],
    productos: [],
    notas: "Primera vez",
    createdAt: "2024-01-17T14:20:00Z"
  },
  {
    id: "4",
    cliente: "Pedro López",
    telefono: "+57 303 456 7890",
    email: "pedro@example.com",
    servicio: "Masaje Therapy Deportivo",
    servicioId: "deportivo",
    fisio: "Dra. Carolina Trujillo",
    fecha: "2024-01-21",
    hora: "09:00",
    duracion: 40,
    precio: 100000,
    estado: "confirmada",
    esAfiliado: false,
    serviciosAdicionales: [],
    productos: [],
    notas: "Atleta, necesita recuperación post-entrenamiento",
    createdAt: "2024-01-18T09:15:00Z"
  },
  {
    id: "5",
    cliente: "Laura Sánchez",
    telefono: "+57 304 567 8901",
    email: "laura@example.com",
    servicio: "Masaje Bienestar General",
    servicioId: "bienestar",
    fisio: "Dra. Carolina Trujillo",
    fecha: "2024-01-21",
    hora: "13:00",
    duracion: 45,
    precio: 140000,
    estado: "cancelada",
    esAfiliado: true,
    serviciosAdicionales: ["Sauna", "Jacuzzi"],
    productos: ["Candado para casillero"],
    notas: "",
    createdAt: "2024-01-19T11:00:00Z"
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const estado = searchParams.get("estado");

    let filteredBookings = [...BOOKINGS];

    // Filtrar por estado si se proporciona
    if (estado) {
      filteredBookings = filteredBookings.filter((b) => b.estado === estado);
    }

    // Para fisio, solo mostrar sus citas
    if (role === "fisio") {
      filteredBookings = filteredBookings.filter(
        (b) => b.fisio === "Dra. Carolina Trujillo"
      );
    }

    return NextResponse.json({ bookings: filteredBookings }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Error al obtener citas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Crear nueva reserva
    const nuevaReserva = {
      id: `RES-${Date.now().toString(36).toUpperCase()}`,
      cliente: body.nombre || 'Cliente',
      telefono: body.telefono || '',
      email: body.email || '',
      servicio: body.terapias?.[0]?.nombre || 'Servicio',
      servicioId: body.terapias?.[0]?.id || '',
      fisio: "Dra. Carolina Trujillo",
      fecha: body.fecha || '',
      hora: body.horario || '',
      duracion: body.duracionTotal || 0,
      precio: body.total || 0,
      estado: "pendiente",
      esAfiliado: body.esAfiliado || false,
      serviciosAdicionales: body.serviciosAdicionales?.map((s: any) => s.nombre || s.id) || [],
      productos: body.productos?.map((p: any) => p.nombre || p.id) || [],
      notas: body.notas || '',
      createdAt: body.fechaCreacion || new Date().toISOString()
    };

    BOOKINGS.push(nuevaReserva);

    return NextResponse.json(
      { success: true, booking: nuevaReserva },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Error al crear reserva" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, accion } = body; // accion: "cancelar", "confirmar", "completar"

    if (!id || !accion) {
      return NextResponse.json(
        { error: "ID y acción requeridos" },
        { status: 400 }
      );
    }

    // Actualizar estado de la reserva
    const reserva = BOOKINGS.find(b => b.id === id);
    if (reserva) {
      if (accion === "cancelar") {
        reserva.estado = "cancelada";
      } else if (accion === "confirmar") {
        reserva.estado = "confirmada";
      } else if (accion === "completar") {
        reserva.estado = "completada";
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Cita ${id} ${accion === "cancelar" ? "cancelada" : accion === "confirmar" ? "confirmada" : "completada"} exitosamente`
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Error al actualizar cita" },
      { status: 500 }
    );
  }
}



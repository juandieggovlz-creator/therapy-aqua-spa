import { NextResponse } from "next/server";

// Base de datos temporal de afiliados (en producción usar BD real)
const AFILIADOS = [
  {
    id: "1",
    email: "afiliado@example.com",
    password: "afiliado123",
    nombre: "Juan Pérez",
    telefono: "+57 301 4185239",
    esAfiliado: true,
  },
  {
    id: "2",
    email: "maria@example.com",
    password: "maria123",
    nombre: "María González",
    telefono: "+57 301 234 5678",
    esAfiliado: true,
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, action } = body; // action: 'login' o 'register'

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json(
          { error: "Email y contraseña requeridos" },
          { status: 400 }
        );
      }

      const afiliado = AFILIADOS.find(
        (a) => a.email === email && a.password === password
      );

      if (!afiliado) {
        return NextResponse.json(
          { error: "Credenciales inválidas" },
          { status: 401 }
        );
      }

      const { password: _, ...afiliadoSinPassword } = afiliado;

      return NextResponse.json(
        {
          success: true,
          afiliado: afiliadoSinPassword,
          token: `token_afiliado_${afiliado.id}_${Date.now()}`,
        },
        { status: 200 }
      );
    }

    if (action === "register") {
      // Lógica de registro (simplificada)
      const { nombre, telefono, email, password } = body;

      if (!nombre || !telefono || !email || !password) {
        return NextResponse.json(
          { error: "Todos los campos son requeridos" },
          { status: 400 }
        );
      }

      // Verificar si ya existe
      if (AFILIADOS.find((a) => a.email === email)) {
        return NextResponse.json(
          { error: "Este email ya está registrado" },
          { status: 409 }
        );
      }

      // En producción, aquí se crearía el nuevo afiliado en BD
      const nuevoAfiliado = {
        id: `afiliado_${Date.now()}`,
        email,
        nombre,
        telefono,
        esAfiliado: true,
      };

      return NextResponse.json(
        {
          success: true,
          message: "Registro exitoso. Por favor inicia sesión.",
          afiliado: nuevoAfiliado,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: "Acción no válida" },
      { status: 400 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}


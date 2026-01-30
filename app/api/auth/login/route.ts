import { NextResponse } from "next/server";

// Credenciales temporales (en producción usar base de datos y hash)
const USERS = {
  admin: {
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Administrador Principal",
    email: "admin@therapyspa.com"
  },
  fisio: {
    username: "fisio",
    password: "fisio123",
    role: "fisio",
    name: "Dra. Carolina Trujillo",
    email: "carolina@therapyspa.com"
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña requeridos" },
        { status: 400 }
      );
    }

    const user = Object.values(USERS).find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // En producción, aquí generaríamos un JWT token
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        success: true,
        user: userWithoutPassword,
        token: `token_${user.username}_${Date.now()}` // Token simple
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}



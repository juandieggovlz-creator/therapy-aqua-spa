import { NextResponse } from "next/server";

// Credenciales seguras (en producción usar base de datos con hash bcrypt)
const USERS = {
  admin: {
    username: "admin@therapyaquaspa.com",
    email: "admin@therapyaquaspa.com",
    password: "TaSpa2026!Admin#Secure",
    role: "admin",
    name: "Administrador Principal"
  },
  fisio: {
    username: "fisio@therapyaquaspa.com",
    email: "fisio@therapyaquaspa.com", 
    password: "Fisio2026!Therapy#Pro",
    role: "fisio",
    name: "Dra. Carolina Trujillo"
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



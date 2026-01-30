import { NextResponse } from 'next/server';

// GET - Obtener configuración pública del sitio
export async function GET() {
  try {
    // Datos estáticos de configuración (TODO: migrar a base de datos cuando la tabla exista)
    const config = {
      nombre_negocio: {
        valor: 'Therapy Aqua Spa',
        tipo: 'texto'
      },
      logo_imagen: {
        valor: '/image/logo-oficial.jpg',
        tipo: 'imagen'
      },
      telefono_contacto: {
        valor: '+57 301 4185239',
        tipo: 'telefono'
      },
      email_contacto: {
        valor: 'contacto@therapyspa.com',
        tipo: 'email'
      },
      direccion: {
        valor: 'Calle 138 Nro. 55-38, Círculo de Suboficiales de las Fuerzas Militares, Bogotá D.C.',
        tipo: 'texto'
      },
      horario_atencion: {
        valor: 'Jue - Dom: 8:00 AM - 4:00 PM',
        tipo: 'texto'
      }
    };

    return NextResponse.json({ 
      configuracion: config,
      success: true 
    });
  } catch (error) {
    console.error('❌ Error obteniendo configuración pública:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}


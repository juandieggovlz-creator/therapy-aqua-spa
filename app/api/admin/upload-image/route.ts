export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { stat } from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se recibió ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo (solo imágenes)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/jfif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Solo se permiten imágenes (JPG, PNG, WEBP, GIF)' },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Tamaño máximo: 10MB' },
        { status: 400 }
      );
    }

    // Crear nombre único para el archivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generar nombre único con timestamp
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const extension = originalName.split('.').pop() || 'jpg';
    const fileName = `${timestamp}_${originalName}`;

    // Ruta donde se guardará la imagen
    const imageDir = join(process.cwd(), 'public', 'image');

    // Crear directorio si no existe
    if (!existsSync(imageDir)) {
      await mkdir(imageDir, { recursive: true });
    }

    const filePath = join(imageDir, fileName);

    // Guardar archivo
    await writeFile(filePath, buffer);

    // Retornar la ruta relativa
    const imageUrl = `/image/${fileName}`;

    return NextResponse.json(
      {
        success: true,
        url: imageUrl,
        fileName: fileName,
        message: 'Imagen subida correctamente'
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error subiendo imagen:', error);
    return NextResponse.json(
      { error: `Error al subir la imagen: ${error.message}` },
      { status: 500 }
    );
  }
}


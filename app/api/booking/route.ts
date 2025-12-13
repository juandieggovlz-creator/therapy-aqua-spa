import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		// Aquí podríamos validar campos requeridos (teléfono obligatorio)
		if (!body?.phone) {
			return NextResponse.json({ error: "Teléfono requerido" }, { status: 400 });
		}
		// Generar un ID simple para la reserva (stub)
		const bookingId = `RES-${Date.now().toString(36).toUpperCase()}`;

		// TODO: Integrar con Google Sheets / DB y webhook de leads
		// Ejemplo: await fetch(process.env.WEBHOOK_URL!, { method: 'POST', body: JSON.stringify({...}) });

		return NextResponse.json({ bookingId }, { status: 201 });
	} catch (e) {
		return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
	}
}









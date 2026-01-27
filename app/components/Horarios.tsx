"use client";

import { useCMS } from "@/app/hooks/useCMS";

type DiaHorario = {
	abierto: boolean;
	apertura: string;
	cierre: string;
};

type Horarios = {
	lunes?: DiaHorario;
	martes?: DiaHorario;
	miercoles?: DiaHorario;
	jueves?: DiaHorario;
	viernes?: DiaHorario;
	sabado?: DiaHorario;
	domingo?: DiaHorario;
};

export default function Horarios() {
	const { contenido } = useCMS();
	
	const horariosCMS: Horarios = contenido?.horarios || {};
	
	// Mapeo de días
	const dias = [
		{ key: 'lunes', label: 'Lunes' },
		{ key: 'martes', label: 'Martes' },
		{ key: 'miercoles', label: 'Miércoles' },
		{ key: 'jueves', label: 'Jueves' },
		{ key: 'viernes', label: 'Viernes' },
		{ key: 'sabado', label: 'Sábado' },
		{ key: 'domingo', label: 'Domingo' }
	];

	const formatearHora = (hora: string) => {
		if (!hora) return '';
		// Convertir formato 24h (08:00) a 12h (08:00 AM)
		const [h, m] = hora.split(':');
		const horaNum = parseInt(h);
		const periodo = horaNum >= 12 ? 'PM' : 'AM';
		const hora12 = horaNum % 12 || 12;
		return `${hora12.toString().padStart(2, '0')}:${m} ${periodo}`;
	};

	const obtenerHorarioTexto = (dia: any) => {
		if (!dia || !dia.abierto) {
			return 'Cerrado';
		}
		const apertura = formatearHora(dia.apertura || '08:00');
		const cierre = formatearHora(dia.cierre || '16:00');
		return `${apertura} – ${cierre}`;
	};

	return (
		<div className="rounded-2xl border border-[color:var(--arena-300)] bg-[color:var(--blanco)] p-6">
			<h3 className="mb-4 text-lg font-semibold text-[color:var(--cafe-900)]" style={{ fontFamily: "var(--font-playfair)" }}>Horario de atención</h3>
			<ul className="space-y-2">
				{dias.map(({ key, label }) => {
					const diaData = horariosCMS[key as keyof typeof horariosCMS] || { abierto: false, apertura: '08:00', cierre: '16:00' };
					const cerrado = !diaData.abierto;
					const horario = obtenerHorarioTexto(diaData);
					
					return (
						<li key={key} className="flex items-center justify-between border-b border-[color:var(--arena-300)]/30 pb-2 last:border-0">
							<span className="font-medium text-[color:var(--cafe-900)]">{label}</span>
							<span className={cerrado ? "text-red-600" : "text-[color:var(--negro-humo)]/80"}>{horario}</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}








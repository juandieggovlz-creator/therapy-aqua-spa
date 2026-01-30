export default function Horarios() {
	const horarios = [
		{ dia: "Lunes", horario: "Cerrado", cerrado: true },
		{ dia: "Martes", horario: "Cerrado", cerrado: true },
		{ dia: "Miércoles", horario: "Cerrado", cerrado: true },
		{ dia: "Jueves", horario: "08:00 AM – 03:30 PM", cerrado: false },
		{ dia: "Viernes", horario: "08:00 AM – 03:30 PM", cerrado: false },
		{ dia: "Sábado", horario: "08:00 AM – 03:30 PM", cerrado: false },
		{ dia: "Domingo", horario: "08:00 AM – 03:30 PM", cerrado: false },
	];

	return (
		<div className="rounded-2xl border border-[color:var(--arena-300)] bg-[color:var(--blanco)] p-6">
			<h3 className="mb-4 text-lg font-semibold text-[color:var(--cafe-900)]" style={{ fontFamily: "var(--font-playfair)" }}>Horario de atención</h3>
			<ul className="space-y-2">
				{horarios.map((h) => (
					<li key={h.dia} className="flex items-center justify-between border-b border-[color:var(--arena-300)]/30 pb-2 last:border-0">
						<span className="font-medium text-[color:var(--cafe-900)]">{h.dia}</span>
						<span className={h.cerrado ? "text-red-600" : "text-[color:var(--negro-humo)]/80"}>{h.horario}</span>
					</li>
				))}
			</ul>
		</div>
	);
}








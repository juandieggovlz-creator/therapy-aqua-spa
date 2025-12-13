import Link from "next/link";
import ServiceImage from "./ServiceImage";

export type Service = {
	key: string;
	title: string;
	duration: string;
	priceLabel: string;
	description?: string;
};

export default function ServiceCard({ service }: { service: Service }) {
	return (
		<div className="group relative overflow-hidden rounded-2xl border border-[color:var(--arena-300)] bg-[color:var(--blanco)] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[color:var(--cafe-900)]/20">
			{/* Efecto de brillo sutil */}
			<div className="absolute inset-0 bg-gradient-to-br from-[color:var(--arena-300)]/0 via-transparent to-[color:var(--oliva-400)]/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />
			<ServiceImage serviceTitle={service.title} serviceKey={service.key} />
			<div className="p-5">
				<h3 className="text-lg font-semibold text-[color:var(--cafe-900)] transition-colors duration-300 group-hover:text-[color:var(--oliva-400)]" style={{ fontFamily: "var(--font-playfair)" }}>{service.title}</h3>
				<p className="mt-1 text-sm text-[color:var(--negro-humo)]/70 transition-all duration-300 group-hover:text-[color:var(--negro-humo)]/90">{service.duration} • {service.priceLabel}</p>
				{service.description && (
					<p className="mt-3 text-sm text-[color:var(--negro-humo)]/80 transition-all duration-300 group-hover:text-[color:var(--negro-humo)]/90">{service.description}</p>
				)}
				<div className="mt-4 flex items-center gap-2">
					<Link 
						href={`/reservas?service=${encodeURIComponent(service.title)}`} 
						className="group/btn relative overflow-hidden rounded-full bg-[color:var(--cafe-900)] px-4 py-2 text-xs font-medium text-[color:var(--blanco)] tracking-wide transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[color:var(--cafe-900)]/50"
					>
						<span className="relative z-10">Reservar</span>
						<span className="absolute inset-0 bg-gradient-to-r from-[color:var(--arena-300)] to-[color:var(--oliva-400)] opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
					</Link>
					<Link 
						href={`/servicios#${service.key}`} 
						className="rounded-full border border-[color:var(--arena-300)] px-4 py-2 text-xs text-[color:var(--cafe-900)] transition-all duration-300 hover:scale-110 hover:border-[color:var(--cafe-900)] hover:bg-[color:var(--cafe-900)] hover:text-[color:var(--blanco)] hover:shadow-md"
					>
						Ver detalles
					</Link>
				</div>
			</div>
		</div>
	);
}



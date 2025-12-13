"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
	{ href: "/", label: "Inicio" },
	{ href: "/servicios", label: "Servicios" },
	{ href: "/reservas", label: "Reservas" },
	{ href: "/promociones", label: "Promociones" },
	{ href: "/sobre-nosotros", label: "Sobre nosotros" },
	{ href: "/testimonios", label: "Testimonios" },
	{ href: "/faqs", label: "FAQs" },
	{ href: "/contacto", label: "Contacto" },
];

export default function Header() {
	const pathname = usePathname();
	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)] bg-[color:var(--crema-50)]/85 backdrop-blur">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
				<Link href="/" className="text-lg font-semibold transition-all duration-300 hover:scale-105 hover:text-[color:var(--cafe-900)]" style={{ fontFamily: "var(--font-playfair)" }}>
					Therapy Aqua Spa
				</Link>
				<nav className="hidden gap-5 md:flex">
					{navItems.map((item) => {
						const active = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={`group/link relative text-xs transition-all duration-300 ${
									active ? "font-semibold text-[color:var(--cafe-900)]" : "text-zinc-700"
								} hover:text-[color:var(--cafe-900)] hover:scale-105`}
							>
								{item.label}
								{!active && (
									<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[color:var(--cafe-900)] transition-all duration-300 group-hover/link:w-full" />
								)}
								{active && (
									<span className="absolute -bottom-1 left-0 h-0.5 w-full bg-[color:var(--cafe-900)]" />
								)}
							</Link>
						);
					})}
				</nav>
				<div className="hidden md:flex gap-2 items-center">
					<Link 
						href="/login/afiliados" 
						className="group relative rounded-full border border-[color:var(--cafe-900)] bg-transparent px-3 py-1.5 text-xs text-[color:var(--cafe-900)] transition-all duration-300 hover:scale-105 hover:bg-[color:var(--cafe-900)] hover:text-[color:var(--blanco)]" 
					>
						<span className="relative z-10 flex items-center gap-1.5">
							<span className="text-sm">🏅</span>
							<span>Afiliados</span>
						</span>
					</Link>
					<Link 
						href="/reservas" 
						className="group relative rounded-full bg-[color:var(--cafe-900)] px-4 py-1.5 text-xs text-[color:var(--blanco)] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[color:var(--cafe-900)]/50" 
					>
						<span className="relative z-10">Reservar</span>
						<span className="absolute inset-0 rounded-full bg-gradient-to-r from-[color:var(--arena-300)] to-[color:var(--oliva-400)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
					</Link>
				</div>
			</div>
		</header>
	);
}
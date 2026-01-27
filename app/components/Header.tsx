"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
	{ href: "/", label: "Inicio" },
	{ href: "/servicios", label: "Servicios" },
	{ href: "/reservas", label: "Reservas" },
	{ href: "/sobre-nosotros", label: "Sobre nosotros" },
	{ href: "/testimonios", label: "Testimonios" },
	{ href: "/faqs", label: "FAQs" },
	{ href: "/contacto", label: "Contacto" },
];

export default function Header() {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [logoData, setLogoData] = useState<{ imagen: string; texto: string } | null>(null);

	// Cargar logo desde CMS
	useEffect(() => {
		const loadLogo = async () => {
			try {
				const res = await fetch('/api/admin/cms');
				const data = await res.json();
				if (data.contenido?.logo) {
					setLogoData(data.contenido.logo);
				} else {
					setLogoData({ imagen: '/image/logo-oficial.jpg', texto: 'Therapy Aqua Spa' });
				}
			} catch (error) {
				console.error('Error cargando logo:', error);
				setLogoData({ imagen: '/image/logo-oficial.jpg', texto: 'Therapy Aqua Spa' });
			}
		};
		loadLogo();
	}, []);

	// Ocultar header solo en el panel de admin (no en login)
	const isAdminPanel = pathname?.startsWith('/login/afiliados/admin');
	
	if (isAdminPanel) {
		return null;
	}

	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)] bg-[color:var(--crema-50)]/85 backdrop-blur">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
				<Link href="/" className="flex items-center gap-3 transition-all duration-300 hover:scale-105 group">
					{logoData?.imagen && (
						<div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
							<Image
								src={logoData.imagen}
								alt={logoData.texto || 'Therapy Aqua Spa'}
								fill
								className="object-contain rounded-lg"
								sizes="48px"
							/>
						</div>
					)}
					<span className="text-lg font-semibold group-hover:text-[color:var(--cafe-900)] transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
						{logoData?.texto || 'Therapy Aqua Spa'}
					</span>
				</Link>
				
				{/* Botón hamburguesa para móviles */}
				<button
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					className="md:hidden p-2 rounded-lg text-[color:var(--cafe-900)] hover:bg-amber-50 transition-colors"
					aria-label="Menú"
				>
					{mobileMenuOpen ? (
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					) : (
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
						</svg>
					)}
				</button>

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
						href="/reservas" 
						className="group relative rounded-full bg-[color:var(--cafe-900)] px-4 py-1.5 text-xs text-[color:var(--blanco)] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[color:var(--cafe-900)]/50" 
					>
						<span className="relative z-10">Reservar</span>
						<span className="absolute inset-0 rounded-full bg-gradient-to-r from-[color:var(--arena-300)] to-[color:var(--oliva-400)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
					</Link>
				</div>
			</div>

			{/* Menú móvil */}
			{mobileMenuOpen && (
				<>
					{/* Overlay para cerrar el menú */}
					<div 
						className="fixed inset-0 bg-black/50 z-40 md:hidden"
						onClick={() => setMobileMenuOpen(false)}
					></div>
					
					{/* Menú desplegable */}
					<div className="fixed top-[60px] left-0 right-0 bg-white border-b border-stone-200 shadow-xl z-50 md:hidden max-h-[calc(100vh-60px)] overflow-y-auto">
						<div className="px-4 py-4 space-y-1">
							{/* Enlaces de navegación */}
							{navItems.map((item) => {
								const active = pathname === item.href;
								return (
									<Link
										key={item.href}
										href={item.href}
										onClick={() => setMobileMenuOpen(false)}
										className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
											active 
												? "bg-amber-50 text-[color:var(--cafe-900)] font-semibold" 
												: "text-zinc-700 hover:bg-stone-50"
										}`}
									>
										{item.label}
									</Link>
								);
							})}

							{/* Botón de reservar */}
							<Link
								href="/reservas"
								onClick={() => setMobileMenuOpen(false)}
								className="block px-4 py-3 rounded-lg bg-[color:var(--cafe-900)] text-white hover:bg-[color:var(--cafe-800)] transition-colors text-center font-semibold"
							>
								Reservar Ahora
							</Link>
						</div>
					</div>
				</>
			)}
		</header>
	);
}
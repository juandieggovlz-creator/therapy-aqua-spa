"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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
	const [afiliado, setAfiliado] = useState<any>(null);
	const [showMenu, setShowMenu] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// Ocultar header solo en el panel de admin (no en login)
	const isAdminPanel = pathname?.startsWith('/login/afiliados/admin');
	
	if (isAdminPanel) {
		return null;
	}

	useEffect(() => {
		// Verificar si hay un afiliado logueado
		const afiliadoToken = sessionStorage.getItem('afiliado_token');
		const afiliadoData = sessionStorage.getItem('afiliado');
		
		if (afiliadoToken && afiliadoData) {
			try {
				setAfiliado(JSON.parse(afiliadoData));
			} catch (e) {
				console.error('Error parsing afiliado data:', e);
			}
		}

		// Escuchar cambios en sessionStorage
		const handleStorageChange = () => {
			const token = sessionStorage.getItem('afiliado_token');
			const data = sessionStorage.getItem('afiliado');
			if (token && data) {
				try {
					setAfiliado(JSON.parse(data));
				} catch (e) {
					setAfiliado(null);
				}
			} else {
				setAfiliado(null);
			}
		};

		window.addEventListener('storage', handleStorageChange);
		
		// También verificar periódicamente por cambios en la misma pestaña
		const interval = setInterval(() => {
			handleStorageChange();
		}, 500);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			clearInterval(interval);
		};
	}, []);

	const handleCerrarSesion = () => {
		sessionStorage.removeItem('afiliado_token');
		sessionStorage.removeItem('afiliado');
		setAfiliado(null);
		setShowMenu(false);
		window.location.href = '/';
	};

	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)] bg-[color:var(--crema-50)]/85 backdrop-blur">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
				<Link href="/" className="text-lg font-semibold transition-all duration-300 hover:scale-105 hover:text-[color:var(--cafe-900)]" style={{ fontFamily: "var(--font-playfair)" }}>
					Therapy Aqua Spa
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
					{afiliado ? (
						<div className="relative">
							<button
								onClick={() => setShowMenu(!showMenu)}
								className="group relative rounded-full border border-[color:var(--cafe-900)] bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1.5 text-xs text-[color:var(--cafe-900)] transition-all duration-300 hover:scale-105 hover:shadow-md flex items-center gap-2"
							>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
									<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
								</svg>
								<span className="font-semibold max-w-[120px] truncate">{afiliado.nombre}</span>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3 h-3 transition-transform duration-300 ${showMenu ? 'rotate-180' : ''}`}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
								</svg>
							</button>
							
							{showMenu && (
								<>
									<div 
										className="fixed inset-0 z-40" 
										onClick={() => setShowMenu(false)}
									></div>
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border-2 border-amber-200 overflow-hidden z-50">
										<div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
											<p className="text-xs text-stone-600 mb-1">Sesión activa</p>
											<p className="text-sm font-semibold text-[color:var(--cafe-900)] truncate">{afiliado.nombre}</p>
										</div>
										<button
											onClick={handleCerrarSesion}
											className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
										>
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
												<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
											</svg>
											Cerrar sesión
										</button>
									</div>
								</>
							)}
						</div>
					) : (
						<Link 
							href="/login/afiliados" 
							className="group relative rounded-full border border-[color:var(--cafe-900)] bg-transparent px-3 py-1.5 text-xs text-[color:var(--cafe-900)] transition-all duration-300 hover:scale-105 hover:bg-[color:var(--cafe-900)] hover:text-[color:var(--blanco)]" 
						>
							<span className="relative z-10 flex items-center gap-1.5">
								<span className="text-sm">🏅</span>
								<span>Afiliados</span>
							</span>
						</Link>
					)}
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

							{/* Separador */}
							<div className="border-t border-stone-200 my-2"></div>

							{/* Botón de afiliado o usuario */}
							{afiliado ? (
								<div className="px-4 py-3">
									<div className="flex items-center gap-3 mb-3">
										<div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
												<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
											</svg>
										</div>
										<div className="flex-1">
											<p className="text-xs text-stone-600">Sesión activa</p>
											<p className="text-sm font-semibold text-[color:var(--cafe-900)] truncate">{afiliado.nombre}</p>
										</div>
									</div>
									<button
										onClick={() => {
											handleCerrarSesion();
											setMobileMenuOpen(false);
										}}
										className="w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 border border-red-200"
									>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
											<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
										</svg>
										Cerrar sesión
									</button>
								</div>
							) : (
								<Link
									href="/login/afiliados"
									onClick={() => setMobileMenuOpen(false)}
									className="block px-4 py-3 rounded-lg border border-[color:var(--cafe-900)] text-[color:var(--cafe-900)] hover:bg-amber-50 transition-colors text-center font-semibold flex items-center justify-center gap-2"
								>
									<span className="text-sm">🏅</span>
									<span>Afiliados</span>
								</Link>
							)}

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
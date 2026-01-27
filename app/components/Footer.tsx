"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCMS } from "@/app/hooks/useCMS";

export default function Footer() {
	const pathname = usePathname();
	const { contenido } = useCMS();
	const [logoData, setLogoData] = useState<{ imagen: string; texto: string } | null>(null);

	useEffect(() => {
		if (contenido?.logo) {
			setLogoData(contenido.logo);
		} else {
			setLogoData({ imagen: '/image/logo-oficial.jpg', texto: 'Therapy Aqua Spa' });
		}
	}, [contenido]);
	
	// Ocultar footer solo en el panel de admin (no en login)
	const isAdminPanel = pathname?.startsWith('/login/afiliados/admin');
	
	if (isAdminPanel) {
		return null;
	}

	const redesSociales = contenido?.redesSociales || { instagram: '', facebook: '', tiktok: '', youtube: '', twitter: '' };

	return (
		<footer className="mt-20 border-t border-[var(--color-border)] bg-[color:var(--cafe-900)] py-10 text-[color:var(--blanco)]">
			<div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-3">
				<div>
					<div className="flex items-center gap-3 mb-2">
						{logoData?.imagen && (
							<Image 
								src={logoData.imagen} 
								alt={logoData.texto || 'Therapy Aqua Spa Logo'} 
								width={40} 
								height={40}
								className="rounded-full object-cover"
							/>
						)}
						<p className="text-lg font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
							{logoData?.texto || 'Therapy Aqua Spa'}
						</p>
					</div>
					<p className="mt-2 text-sm opacity-80">Respira. Relájate. Renueva.</p>
					
					{/* Redes Sociales */}
					{(redesSociales.instagram || redesSociales.facebook || redesSociales.tiktok || redesSociales.youtube || redesSociales.twitter) && (
						<div className="mt-4 flex gap-3">
							{redesSociales.instagram && (
								<a href={redesSociales.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
									<span className="text-lg">📷</span>
								</a>
							)}
							{redesSociales.facebook && (
								<a href={redesSociales.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
									<span className="text-lg">👥</span>
								</a>
							)}
							{redesSociales.tiktok && (
								<a href={redesSociales.tiktok} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
									<span className="text-lg">🎵</span>
								</a>
							)}
							{redesSociales.youtube && (
								<a href={redesSociales.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
									<span className="text-lg">▶️</span>
								</a>
							)}
							{redesSociales.twitter && (
								<a href={redesSociales.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
									<span className="text-lg">🐦</span>
								</a>
							)}
						</div>
					)}
				</div>
				<div>
					<p className="text-sm font-medium">Enlaces</p>
					<ul className="mt-2 space-y-2 text-sm opacity-90">
						<li><Link href="/promociones" className="transition-all duration-300 hover:translate-x-1 hover:opacity-100 hover:underline">Promociones</Link></li>
						<li><Link href="/testimonios" className="transition-all duration-300 hover:translate-x-1 hover:opacity-100 hover:underline">Testimonios</Link></li>
						<li><Link href="/faqs" className="transition-all duration-300 hover:translate-x-1 hover:opacity-100 hover:underline">FAQs</Link></li>
						<li><Link href="/sobre-nosotros" className="transition-all duration-300 hover:translate-x-1 hover:opacity-100 hover:underline">Sobre Nosotros</Link></li>
						<li><Link href="/contacto" className="transition-all duration-300 hover:translate-x-1 hover:opacity-100 hover:underline">Contacto</Link></li>
					</ul>
				</div>
				<div>
					<p className="text-sm font-medium">Contacto</p>
					<ul className="mt-2 space-y-2 text-sm opacity-90">
						{contenido?.contacto?.telefono && (
							<li className="flex items-center gap-2">
								<span>📞</span>
								<a href={`tel:${contenido.contacto.telefono}`} className="hover:opacity-100 hover:underline">{contenido.contacto.telefono}</a>
							</li>
						)}
						{contenido?.contacto?.email && (
							<li className="flex items-center gap-2">
								<span>✉️</span>
								<a href={`mailto:${contenido.contacto.email}`} className="hover:opacity-100 hover:underline">{contenido.contacto.email}</a>
							</li>
						)}
						{contenido?.contacto?.whatsappLink && (
							<li className="flex items-center gap-2">
								<span>💬</span>
								<a href={contenido.contacto.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 hover:underline">WhatsApp</a>
							</li>
						)}
						{contenido?.contacto?.horariosAtencion && (
							<li className="flex items-center gap-2 mt-4 pt-4 border-t border-white/20">
								<span>🕐</span>
								<span>{contenido.contacto.horariosAtencion}</span>
							</li>
						)}
					</ul>
				</div>
			</div>
			<div className="mx-auto mt-8 max-w-6xl px-4 text-xs opacity-75">© {new Date().getFullYear()} {logoData?.texto || 'Therapy Aqua Spa'}</div>
		</footer>
	);
}



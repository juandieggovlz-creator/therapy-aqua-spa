"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
	const pathname = usePathname();
	const [contacto, setContacto] = useState({
		telefono: '+57 301 4185239',
		email: 'contacto@therapyspa.com',
		whatsappLink: 'https://wa.me/573014185239',
		horariosAtencion: 'Jue - Dom: 8:00 AM - 4:00 PM',
		logo: '/image/logo-oficial.jpg',
		texto: 'Therapy Aqua Spa'
	});

	const cargarContacto = async () => {
		try {
			const res = await fetch('/api/configuracion-publica');
			const data = await res.json();
			if (data.success && data.configuracion) {
				const c = data.configuracion;
				setContacto({
					telefono: c.contact_whatsapp?.valor || '+57 301 4185239',
					email: c.contact_email?.valor || 'contacto@therapyspa.com',
					whatsappLink: `https://wa.me/${(c.contact_whatsapp?.valor || '573014185239').replace(/\D/g, '')}`,
					horariosAtencion: c.contact_schedule?.valor || 'Jue - Dom: 8:00 AM - 4:00 PM',
					logo: c.branding_logo?.valor || '/image/logo-oficial.jpg',
					texto: c.branding_name?.valor || 'Therapy Aqua Spa'
				});
			}
		} catch (error) {
			console.error('Error cargando contacto en footer:', error);
		}
	};

	useEffect(() => {
		cargarContacto();
		window.addEventListener('actualizarPaginaPrincipal', cargarContacto);
		return () => window.removeEventListener('actualizarPaginaPrincipal', cargarContacto);
	}, []);

	// Ocultar footer solo en el panel de admin
	const isAdminPanel = pathname?.startsWith('/login/afiliados/admin');
	if (isAdminPanel) return null;

	return (
		<footer className="mt-20 border-t border-[var(--color-border)] bg-[color:var(--cafe-900)] py-10 text-[color:var(--blanco)]">
			<div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-3">
				<div>
					<div className="flex items-center gap-3 mb-2">
						{contacto.logo && (
							<Image
								src={contacto.logo}
								alt={contacto.texto}
								width={40}
								height={40}
								className="rounded-full object-cover"
							/>
						)}
						<p className="text-lg font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
							{contacto.texto}
						</p>
					</div>
					<p className="mt-2 text-sm opacity-80">Respira. Relájate. Renueva.</p>

					<div className="mt-4 flex gap-3">
						<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
							<span className="text-lg">📷</span>
						</a>
						<a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
							<span className="text-lg">👥</span>
						</a>
					</div>
				</div>
				<div>
					<p className="text-sm font-medium">Enlaces</p>
					<ul className="mt-2 space-y-2 text-sm opacity-90">
						<li><Link href="/promociones" className="hover:underline">Promociones</Link></li>
						<li><Link href="/testimonios" className="hover:underline">Testimonios</Link></li>
						<li><Link href="/faqs" className="hover:underline">FAQs</Link></li>
						<li><Link href="/sobre-nosotros" className="hover:underline">Sobre Nosotros</Link></li>
						<li><Link href="/contacto" className="hover:underline">Contacto</Link></li>
					</ul>
				</div>
				<div>
					<p className="text-sm font-medium">Contacto</p>
					<ul className="mt-2 space-y-2 text-sm opacity-90">
						<li className="flex items-center gap-2">
							<span>📞</span>
							<a href={`tel:${contacto.telefono}`} className="hover:underline">{contacto.telefono}</a>
						</li>
						<li className="flex items-center gap-2">
							<span>✉️</span>
							<a href={`mailto:${contacto.email}`} className="hover:underline">{contacto.email}</a>
						</li>
						<li className="flex items-center gap-2">
							<span>💬</span>
							<a href={contacto.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:underline">WhatsApp</a>
						</li>
						<li className="flex items-center gap-2 mt-4 pt-4 border-t border-white/20">
							<span>🕐</span>
							<span>{contacto.horariosAtencion}</span>
						</li>
					</ul>
				</div>
			</div>
			<div className="mx-auto mt-8 max-w-6xl px-4 text-xs opacity-75">
				© {new Date().getFullYear()} {contacto.texto}
				<Link href="/login/admin" className="ml-4 opacity-50 hover:opacity-100 transition-opacity">Acceso Interno</Link>
			</div>
		</footer>
	);
}



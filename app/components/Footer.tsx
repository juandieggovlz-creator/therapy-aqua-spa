import Link from "next/link";

export default function Footer() {
	return (
		<footer className="mt-20 border-t border-[var(--color-border)] bg-[color:var(--cafe-900)] py-10 text-[color:var(--blanco)]">
			<div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-3">
				<div>
					<p className="text-lg font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>Therapy Aqua Spa</p>
					<p className="mt-2 text-sm opacity-80">Respira. Relájate. Renueva.</p>
				</div>
				<div>
					<p className="text-sm font-medium">Enlaces</p>
					<ul className="mt-2 space-y-2 text-sm opacity-90">
						<li><Link href="/promociones" className="transition-all duration-300 hover:translate-x-1 hover:opacity-100 hover:underline">Promociones</Link></li>
						<li><Link href="/testimonios" className="transition-all duration-300 hover:translate-x-1 hover:opacity-100 hover:underline">Testimonios</Link></li>
						<li><Link href="/faqs" className="transition-all duration-300 hover:translate-x-1 hover:opacity-100 hover:underline">FAQs</Link></li>
					</ul>
				</div>
				<div>
					<p className="text-sm font-medium">Legal</p>
					<ul className="mt-2 space-y-2 text-sm opacity-90">
						<li><Link href="/legal/privacidad" className="transition-all duration-300 hover:translate-x-1 hover:opacity-100 hover:underline">Política de privacidad</Link></li>
						<li><Link href="/legal/terminos" className="transition-all duration-300 hover:translate-x-1 hover:opacity-100 hover:underline">Términos y condiciones</Link></li>
					</ul>
				</div>
			</div>
			<div className="mx-auto mt-8 max-w-6xl px-4 text-xs opacity-75">© {new Date().getFullYear()} Therapy Aqua Spa</div>
		</footer>
	);
}



import Link from "next/link";

export default function StickyBar() {
	return (
		<div className="fixed inset-x-0 bottom-0 z-50 mx-auto block w-full border-t border-[var(--color-border)] bg-[color:var(--crema-50)]/95 px-4 py-2 backdrop-blur md:hidden">
			<div className="mx-auto flex max-w-6xl items-center gap-3">
				<Link href="/reservas" className="flex-1 rounded-full bg-[color:var(--cafe-900)] py-3 text-center text-[color:var(--blanco)]">
					Reservar
				</Link>
				<a
					href="https://wa.me/573014185239"
					target="_blank"
					rel="noopener noreferrer"
					className="flex-1 rounded-full border border-[color:var(--arena-300)] bg-[color:var(--blanco)] py-3 text-center text-[color:var(--cafe-900)] transition-all hover:scale-105 hover:shadow-md active:scale-95"
				>
					WhatsApp
				</a>
			</div>
		</div>
	);
}



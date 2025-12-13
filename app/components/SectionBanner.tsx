"use client";
import Image from "next/image";

// IDs de imágenes profesionales de Unsplash por sección
const bannerImageIds: Record<string, string> = {
	"sobre-nosotros": "1571019618244-de8f1929a5a8", // Imagen profesional de spa/terapia
	servicios: "1540553016722-983e48a2cd10",
	promociones: "1506126613408-eca07ce68773",
	testimonios: "1519494026899-7f0d0a8946d0",
	faqs: "1544161515-4ab6ce6db874",
	contacto: "1506126613408-eca07ce68773",
	privacidad: "1540553016722-983e48a2cd10",
	terminos: "1540553016722-983e48a2cd10",
	admin: "1540553016722-983e48a2cd10",
	fisioterapeuta: "1571019618244-de8f1929a5a8",
};

// Imagen por defecto elegante
const defaultImageId = "1540553016722-983e48a2cd10";

const getBannerImageUrl = (slug: string) => {
	const imageId = bannerImageIds[slug] || defaultImageId;
	return `https://images.unsplash.com/photo-${imageId}?w=1920&h=400&fit=crop&q=85&auto=format`;
};

export default function SectionBanner({ title, slug }: { title: string; slug: string }) {
	const imageUrl = getBannerImageUrl(slug);
	const fallbackUrl = `/banners/${slug}.jpg`;

	return (
		<section className="relative mb-8 overflow-hidden rounded-2xl border border-[color:var(--arena-300)] shadow-lg">
			<div className="relative h-56 w-full md:h-64 lg:h-72">
				<Image
					src={imageUrl}
					alt={title}
					fill
					className="object-cover object-center"
					sizes="100vw"
					priority={slug === "sobre-nosotros"}
					quality={90}
					onError={(e) => {
						const target = e.target as HTMLImageElement;
						if (target.src !== fallbackUrl) {
							target.src = fallbackUrl;
						}
					}}
				/>
				{/* Overlay con gradiente elegante */}
				<div className="absolute inset-0 bg-gradient-to-br from-[color:var(--cafe-900)]/50 via-[color:var(--cafe-900)]/30 to-[color:var(--oliva-400)]/40" />
				<div className="absolute inset-0 bg-gradient-to-t from-[color:var(--cafe-900)]/60 via-transparent to-transparent" />
			</div>
			<div className="absolute inset-0 flex items-end justify-start">
				<div className="w-full px-6 pb-6 md:px-8 md:pb-8">
					<h1 className="text-2xl font-semibold text-[color:var(--blanco)] drop-shadow-lg md:text-3xl lg:text-4xl" style={{ fontFamily: "var(--font-playfair)" }}>
						{title}
					</h1>
					{slug === "sobre-nosotros" && (
						<p className="mt-2 max-w-2xl text-sm text-[color:var(--blanco)]/90 drop-shadow-md md:text-base">
							Conoce nuestro equipo, nuestra filosofía y nuestro compromiso contigo
						</p>
					)}
				</div>
			</div>
		</section>
	);
}



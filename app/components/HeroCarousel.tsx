"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

// IDs de fotos de Unsplash para spa/masaje (imágenes reales)
const heroImageIds = [
	"1540553016722-983e48a2cd10", // Masaje relajante con velas
	"1506126613408-eca07ce68773", // Still life spa
	"1519494026899-7f0d0a8946d0", // Banner spa con elementos
];

// Generar URLs de imágenes usando Unsplash basado en photo IDs
const getHeroImageUrl = (photoId: string, width = 1920, height = 1080) => {
	return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&q=80&auto=format`;
};

const carouselImages = [
	{
		src: getHeroImageUrl(heroImageIds[0]),
		alt: "Masaje relajante con velas",
		fallback: "/hero/masaje-relajante.jpg",
	},
	{
		src: getHeroImageUrl(heroImageIds[1]),
		alt: "Ambiente spa con velas y toallas",
		fallback: "/hero/spa-still-life.jpg",
	},
	{
		src: getHeroImageUrl(heroImageIds[2]),
		alt: "Banner spa con elementos de relajación",
		fallback: "/hero/spa-banner.jpg",
	},
];

export default function HeroCarousel() {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
		}, 5000); // Cambia cada 5 segundos

		return () => clearInterval(interval);
	}, []);

	const goToSlide = (index: number) => {
		setCurrentIndex(index);
	};

	const goToPrevious = () => {
		setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
	};

	const goToNext = () => {
		setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
	};

	return (
		<section className="relative min-h-[80vh] overflow-hidden">
			{/* Carrusel de imágenes con efecto reflejo */}
			<div className="absolute inset-0">
				{carouselImages.map((image, index) => (
					<div
						key={index}
						className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
							index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
						}`}
					>
						{/* Imagen principal */}
						<div className="absolute inset-0">
							<Image
								src={image.src}
								alt={image.alt}
								fill
								priority={index === 0}
								className="object-cover object-center"
								sizes="100vw"
								quality={90}
								unoptimized={false}
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									if (image.fallback && target.src !== image.fallback) {
										target.src = image.fallback;
									}
								}}
							/>
							{/* Overlay con gradiente */}
							<div className="absolute inset-0 bg-gradient-to-b from-[color:var(--cafe-900)]/60 via-[color:var(--cafe-900)]/40 to-[color:var(--cafe-900)]/50" />
						</div>
						
						{/* Efecto de reflejo en la parte inferior */}
						<div className="absolute inset-x-0 bottom-0 h-[40%] overflow-hidden opacity-25">
							<div className="h-full scale-y-[-1] transform">
								<Image
									src={image.src}
									alt={`${image.alt} - reflejo`}
									fill
									className="object-cover object-bottom"
									sizes="100vw"
									quality={90}
									unoptimized={false}
									onError={(e) => {
										const target = e.target as HTMLImageElement;
										if (image.fallback && target.src !== image.fallback) {
											target.src = image.fallback;
										}
									}}
								/>
								{/* Gradiente para el reflejo */}
								<div className="absolute inset-0 bg-gradient-to-t from-[color:var(--cafe-900)]/80 via-transparent to-transparent" />
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Contenido del hero superpuesto */}
			<div className="relative z-20 flex min-h-[80vh] items-center justify-center">
				<div className="mx-auto max-w-4xl px-6 text-center">
					<div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--arena-300)]/60 bg-[color:var(--blanco)]/80 backdrop-blur-sm px-3 py-1 text-xs text-[color:var(--cafe-900)]">
						<span>5.0 Excelente</span>
						<span>•</span>
						<span>Therapy Aqua Spa</span>
					</div>
					<h1 className="text-4xl font-semibold tracking-tight text-[color:var(--blanco)] drop-shadow-lg sm:text-5xl" style={{ fontFamily: "var(--font-playfair)" }}>
						Bienestar profundo, equilibrio natural — Therapy Aqua Spa
					</h1>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-[color:var(--blanco)]/90 drop-shadow-md">
						Reserva tu terapia y déjanos cuidar de ti.
					</p>
					<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<Link 
							href="/reservas" 
							className="group/btn relative overflow-hidden rounded-full bg-[color:var(--blanco)] px-6 py-3 text-[color:var(--cafe-900)] transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-[color:var(--blanco)]/50" 
							style={{ letterSpacing: "0.04em" }}
						>
							<span className="relative z-10">RESERVAR AHORA</span>
							<span className="absolute inset-0 bg-gradient-to-r from-[color:var(--arena-300)] to-[color:var(--oliva-400)] opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
						</Link>
						<Link 
							href="/servicios" 
							className="rounded-full border-2 border-[color:var(--blanco)] bg-transparent px-6 py-3 text-[color:var(--blanco)] backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-[color:var(--blanco)]/30 hover:shadow-lg hover:shadow-[color:var(--blanco)]/30"
						>
							Ver terapias
						</Link>
					</div>
				</div>
			</div>

			{/* Botones de navegación */}
			<button
				onClick={goToPrevious}
				className="group absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-[color:var(--blanco)]/20 p-2 text-[color:var(--blanco)] backdrop-blur-sm transition-all duration-300 hover:bg-[color:var(--blanco)]/40 hover:scale-125 hover:shadow-xl hover:shadow-[color:var(--blanco)]/50"
				aria-label="Imagen anterior"
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6 transition-transform duration-300 group-hover:-translate-x-1">
					<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
				</svg>
			</button>
			<button
				onClick={goToNext}
				className="group absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-[color:var(--blanco)]/20 p-2 text-[color:var(--blanco)] backdrop-blur-sm transition-all duration-300 hover:bg-[color:var(--blanco)]/40 hover:scale-125 hover:shadow-xl hover:shadow-[color:var(--blanco)]/50"
				aria-label="Imagen siguiente"
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1">
					<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
				</svg>
			</button>

			{/* Indicadores */}
			<div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
				{carouselImages.map((_, index) => (
					<button
						key={index}
						onClick={() => goToSlide(index)}
						className={`h-2 rounded-full transition-all duration-300 ${
							index === currentIndex
								? "w-8 bg-[color:var(--blanco)] shadow-lg shadow-[color:var(--blanco)]/50"
								: "w-2 bg-[color:var(--blanco)]/40 hover:bg-[color:var(--blanco)]/80 hover:scale-125 hover:shadow-md"
						}`}
						aria-label={`Ir a imagen ${index + 1}`}
					/>
				))}
			</div>
		</section>
	);
}


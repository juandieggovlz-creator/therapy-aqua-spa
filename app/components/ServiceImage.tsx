"use client";
import Image from "next/image";

// Generar URL de imagen de Unsplash basado en el título del servicio
export function getServiceImageUrl(serviceTitle: string, serviceKey: string): string {
	// Mapeo de keywords por servicio para generar imágenes relevantes
	const keywords: Record<string, string> = {
		columna: "spine therapy physical therapy back treatment",
		"musculares-brazos": "arm massage therapy muscle treatment",
		"musculares-piernas": "leg massage therapy muscle treatment",
		"trauma-superior": "shoulder elbow wrist trauma therapy treatment",
		"trauma-inferior": "hip knee ankle trauma therapy treatment",
		"skincare-mano": "hand skincare spa treatment luxury",
		"preso-ocular": "eye therapy treatment relaxation spa",
		"bienestar-general": "full body massage spa wellness relaxation",
		facial: "facial massage skincare spa treatment",
		espalda: "back massage therapy relaxation",
		"hombros-brazos": "shoulder arm massage therapy",
		"caderas-rodillas": "hip knee massage therapy treatment",
		"pantorrillas-pies": "calf foot massage therapy spa",
		deportivo: "sports massage therapy athletic treatment",
	};

	const searchTerm = keywords[serviceKey] || serviceTitle.toLowerCase();
	const encodedTerm = encodeURIComponent(searchTerm);
	
	// Usar Unsplash Source API con búsqueda por keywords
	// IDs de fotos específicas por servicio tipo spa/masaje
	const imageIds: Record<string, string> = {
		columna: "1540553016722-983e48a2cd10",
		"musculares-brazos": "1506126613408-eca07ce68773",
		"musculares-piernas": "1519494026899-7f0d0a8946d0",
		"trauma-superior": "1571019618244-de8f1929a5a8",
		"trauma-inferior": "1576678927484-b032ba143781",
		"skincare-mano": "1571019618244-de8f1929a5a8",
		"preso-ocular": "1540553016722-983e48a2cd10",
		"bienestar-general": "1544161515-4ab6ce6db874",
		facial: "1506126613408-eca07ce68773",
		espalda: "1519494026899-7f0d0a8946d0",
		"hombros-brazos": "1540553016722-983e48a2cd10",
		"caderas-rodillas": "1506126613408-eca07ce68773",
		"pantorrillas-pies": "1519494026899-7f0d0a8946d0",
		deportivo: "1544161515-4ab6ce6db874",
	};
	
	const photoId = imageIds[serviceKey] || "1544161515-4ab6ce6db874";
	return `https://images.unsplash.com/photo-${photoId}?w=800&h=600&fit=crop&q=80&auto=format`;
}

type ServiceImageProps = {
	serviceTitle: string;
	serviceKey: string;
};

export default function ServiceImage({ serviceTitle, serviceKey }: ServiceImageProps) {
	const imageUrl = getServiceImageUrl(serviceTitle, serviceKey);
	const fallbackUrl = `/services/${serviceKey}.jpg`;

	return (
		<>
			{/* Imagen principal */}
			<div className="relative h-36 w-full overflow-hidden bg-[color:var(--crema-50)]">
				<Image
					src={imageUrl}
					alt={serviceTitle}
					fill
					className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
					priority={false}
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
					onError={(e) => {
						const target = e.target as HTMLImageElement;
						if (target.src !== fallbackUrl) {
							target.src = fallbackUrl;
						}
					}}
				/>
				{/* Overlay sutil */}
				<div className="absolute inset-0 bg-gradient-to-t from-[color:var(--cafe-900)]/20 to-transparent" />
			</div>
			
			{/* Efecto de reflejo */}
			<div className="relative h-24 w-full overflow-hidden bg-[color:var(--crema-50)] opacity-40">
				<div className="h-full scale-y-[-1]">
					<Image
						src={imageUrl}
						alt={`${serviceTitle} - reflejo`}
						fill
						className="object-cover object-center"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
						onError={(e) => {
							const target = e.target as HTMLImageElement;
							if (target.src !== fallbackUrl) {
								target.src = fallbackUrl;
							}
						}}
					/>
					{/* Gradiente para el reflejo */}
					<div className="absolute inset-0 bg-gradient-to-t from-[color:var(--crema-50)] via-transparent to-transparent" />
				</div>
			</div>
		</>
	);
}


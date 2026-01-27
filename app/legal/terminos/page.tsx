"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function TerminosPage() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(true);
	}, []);

	return (
		<main className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-100">
			<style jsx>{`
				@keyframes fadeInUp {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				.animate-fade-in-up {
					animation: fadeInUp 0.6s ease-out forwards;
				}
				@keyframes shimmer {
					0% { background-position: -1000px 0; }
					100% { background-position: 1000px 0; }
				}
				.animate-shimmer {
					background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
					background-size: 200% 100%;
					animation: shimmer 3s infinite;
				}
			`}</style>

			{/* Header con efectos */}
			<div className="relative overflow-hidden bg-gradient-to-br from-[#3d2817] via-amber-900 to-[#2d1f11]">
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full opacity-20 blur-3xl" />
					<div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full opacity-20 blur-3xl" />
				</div>
				<div className="relative z-10 mx-auto max-w-4xl px-4 py-16 md:py-20">
					<div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
						<div className="inline-block mb-4">
							<span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
								📋 Documento Legal
							</span>
						</div>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
							Términos y Condiciones
						</h1>
						<p className="text-xl text-amber-100 max-w-2xl mx-auto">
							Conoce las condiciones de uso de nuestros servicios
						</p>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-4xl px-4 py-12">
				<div className="space-y-6">
					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								1
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Información General
								</h2>
								<p className="mb-4 leading-relaxed text-stone-700">
									Los presentes términos y condiciones regulan el uso de los servicios ofrecidos por <strong className="text-[#3d2817]">Therapy Aqua Spa</strong>, 
									ubicado en Calle 138 Nro. 55-38, Círculo de Suboficiales de las Fuerzas Militares, Bogotá D.C., Colombia.
								</p>
								<p className="leading-relaxed text-stone-700">
									Al realizar una reserva o utilizar nuestros servicios, el cliente acepta estos términos y condiciones en su totalidad.
								</p>
							</div>
						</div>
					</section>

					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								2
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Reservas y Cancelaciones
								</h2>
								<div className="space-y-4">
									<div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-l-4 border-amber-500">
										<h3 className="font-semibold text-[#3d2817] mb-2">2.1 Reservas</h3>
										<p className="leading-relaxed text-stone-700">
											Las reservas pueden realizarse a través de nuestro sitio web, WhatsApp oficial o presencialmente en nuestras instalaciones. 
											Todas las reservas están sujetas a disponibilidad.
										</p>
									</div>
									<div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-l-4 border-amber-500">
										<h3 className="font-semibold text-[#3d2817] mb-2">2.2 Cancelaciones y Modificaciones</h3>
										<p className="leading-relaxed text-stone-700">
											Las cancelaciones o modificaciones deben realizarse con al menos 24 horas de anticipación. 
											Las cancelaciones con menos de 24 horas de anticipación pueden estar sujetas a cargos adicionales.
										</p>
									</div>
									<div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-l-4 border-amber-500">
										<h3 className="font-semibold text-[#3d2817] mb-2">2.3 No Show</h3>
										<p className="leading-relaxed text-stone-700">
											En caso de no presentarse a la cita reservada sin previo aviso, se podrá aplicar un cargo equivalente al 50% del valor del servicio.
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								3
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Pagos
								</h2>
								<div className="space-y-4">
									<div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-l-4 border-amber-500">
										<h3 className="font-semibold text-[#3d2817] mb-2">3.1 Métodos de Pago</h3>
										<p className="leading-relaxed text-stone-700">
											Aceptamos pagos en efectivo, transferencias Nequi y pagos con tarjeta a través de Wompi. 
											El pago debe realizarse al momento de la prestación del servicio, salvo acuerdos previos.
										</p>
									</div>
									<div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-l-4 border-amber-500">
										<h3 className="font-semibold text-[#3d2817] mb-2">3.2 Precios</h3>
										<p className="leading-relaxed text-stone-700">
											Los precios publicados en nuestro sitio web están sujetos a cambios sin previo aviso. 
											Los precios finales se confirmarán al momento de la reserva.
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								4
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Promociones y Descuentos
								</h2>
								<p className="leading-relaxed mb-4 text-stone-700">
									Las promociones y descuentos son válidos únicamente durante el período indicado y no son acumulables con otras ofertas. 
									Los descuentos para afiliados aplican únicamente a servicios adicionales (sauna, jacuzzi, baño turco) y no a las terapias principales.
								</p>
								<p className="leading-relaxed text-stone-700">
									Therapy Aqua Spa se reserva el derecho de modificar o cancelar cualquier promoción sin previo aviso.
								</p>
							</div>
						</div>
					</section>

					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								5
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Servicios y Tratamientos
								</h2>
								<div className="space-y-4">
									<div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-l-4 border-amber-500">
										<h3 className="font-semibold text-[#3d2817] mb-2">5.1 Duración de los Servicios</h3>
										<p className="leading-relaxed text-stone-700">
											Las duraciones indicadas son aproximadas y pueden variar según las necesidades específicas de cada cliente.
										</p>
									</div>
									<div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-l-4 border-amber-500">
										<h3 className="font-semibold text-[#3d2817] mb-2">5.2 Contraindicaciones</h3>
										<p className="leading-relaxed text-stone-700">
											Es responsabilidad del cliente informar sobre cualquier condición médica, lesión o contraindicación antes de recibir el servicio. 
											Therapy Aqua Spa no se hace responsable por complicaciones derivadas de información no proporcionada.
										</p>
									</div>
									<div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-l-4 border-amber-500">
										<h3 className="font-semibold text-[#3d2817] mb-2">5.3 Zonas Húmedas</h3>
										<p className="leading-relaxed text-stone-700">
											Por seguridad e higiene, no se permite el uso de dispositivos móviles ni grabaciones en las zonas húmedas (sauna, jacuzzi, baño turco).
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								6
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Responsabilidades
								</h2>
								<div className="space-y-4">
									<div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-l-4 border-amber-500">
										<h3 className="font-semibold text-[#3d2817] mb-2">6.1 Del Cliente</h3>
										<p className="leading-relaxed text-stone-700">
											El cliente es responsable de llegar puntualmente a su cita, informar sobre condiciones médicas relevantes, 
											y respetar las normas de uso de las instalaciones.
										</p>
									</div>
									<div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-l-4 border-amber-500">
										<h3 className="font-semibold text-[#3d2817] mb-2">6.2 De Therapy Aqua Spa</h3>
										<p className="leading-relaxed text-stone-700">
											Therapy Aqua Spa se compromete a brindar servicios profesionales de calidad, mantener la confidencialidad de la información del cliente, 
											y proporcionar un ambiente seguro y relajante.
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								7
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Propiedad Intelectual
								</h2>
								<p className="leading-relaxed text-stone-700">
									Todo el contenido del sitio web, incluyendo textos, imágenes, logotipos y diseños, es propiedad de Therapy Aqua Spa 
									y está protegido por las leyes de propiedad intelectual. No está permitida su reproducción sin autorización previa.
								</p>
							</div>
						</div>
					</section>

					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								8
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Modificaciones de los Términos
								</h2>
								<p className="leading-relaxed text-stone-700">
									Therapy Aqua Spa se reserva el derecho de modificar estos términos y condiciones en cualquier momento. 
									Las modificaciones entrarán en vigor desde su publicación en el sitio web.
								</p>
							</div>
						</div>
					</section>

					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.9s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								9
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Contacto
								</h2>
								<p className="leading-relaxed mb-4 text-stone-700">
									Para cualquier consulta sobre estos términos y condiciones, puede contactarnos a través de:
								</p>
								<div className="space-y-3">
									<div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-l-4 border-green-500">
										<p className="leading-relaxed text-stone-700">
											<strong className="text-[#3d2817]">WhatsApp:</strong> <a href="https://wa.me/573014185239" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 hover:underline font-semibold">+57 301 4185239</a>
										</p>
									</div>
									<div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-l-4 border-amber-500">
										<p className="leading-relaxed text-stone-700">
											<strong className="text-[#3d2817]">Ubicación:</strong> Calle 138 Nro. 55-38, Círculo de Suboficiales de las Fuerzas Militares, Bogotá D.C., Colombia
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className={`bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 rounded-3xl p-6 md:p-8 border-2 border-amber-300 shadow-xl relative overflow-hidden ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
						<div className="absolute inset-0 animate-shimmer opacity-30" />
						<div className="relative z-10">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
										<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<h3 className="text-lg font-bold text-[#3d2817]">Información Importante</h3>
							</div>
							<p className="text-sm text-stone-700 leading-relaxed mb-2">
								<strong>Última actualización:</strong> {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
							</p>
							<p className="text-sm text-stone-700 leading-relaxed">
								Al utilizar nuestros servicios, usted acepta haber leído y comprendido estos términos y condiciones.
							</p>
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}

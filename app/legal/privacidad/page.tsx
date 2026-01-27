"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PrivacidadPage() {
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
								🔒 Protección de Datos
							</span>
						</div>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
							Política de Privacidad
						</h1>
						<p className="text-xl text-amber-100 max-w-2xl mx-auto">
							Tu privacidad es nuestra prioridad
						</p>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-4xl px-4 py-12">
				<div className="space-y-6">
					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								1
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Introducción
								</h2>
								<p className="mb-4 leading-relaxed text-stone-700">
									En <strong className="text-[#3d2817]">Therapy Aqua Spa</strong>, ubicado en Calle 138 Nro. 55-38, Círculo de Suboficiales de las Fuerzas Militares, 
									Bogotá D.C., Colombia, nos comprometemos a proteger la privacidad y confidencialidad de la información personal de nuestros clientes.
								</p>
								<p className="leading-relaxed text-stone-700">
									Esta política de privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos su información personal 
									cuando utiliza nuestros servicios o visita nuestro sitio web.
								</p>
							</div>
						</div>
					</section>

					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								2
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Información que Recopilamos
								</h2>
								<div className="space-y-4">
									<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-500">
										<h3 className="font-semibold text-[#3d2817] mb-2">2.1 Información Personal</h3>
										<p className="leading-relaxed mb-2 text-stone-700">
											Recopilamos la siguiente información cuando realiza una reserva o utiliza nuestros servicios:
										</p>
										<ul className="ml-6 list-disc space-y-1 text-stone-700">
											<li>Nombre completo</li>
											<li>Número de teléfono</li>
											<li>Dirección de correo electrónico</li>
											<li>Información de afiliación (si aplica)</li>
											<li>Preferencias de servicio y notas adicionales</li>
										</ul>
									</div>
									<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-500">
										<h3 className="font-semibold text-[#3d2817] mb-2">2.2 Información de Uso</h3>
										<p className="leading-relaxed text-stone-700">
											Podemos recopilar información sobre cómo utiliza nuestro sitio web, incluyendo páginas visitadas, 
											tiempo de permanencia y acciones realizadas, para mejorar la experiencia del usuario.
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								3
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Uso de la Información
								</h2>
								<p className="mb-4 leading-relaxed text-stone-700">
									Utilizamos la información recopilada para los siguientes propósitos:
								</p>
								<ul className="ml-6 list-disc space-y-2 text-stone-700">
									<li className="leading-relaxed">Procesar y gestionar sus reservas</li>
									<li className="leading-relaxed">Comunicarnos con usted sobre su reserva y nuestros servicios</li>
									<li className="leading-relaxed">Enviar confirmaciones y recordatorios de citas</li>
									<li className="leading-relaxed">Mejorar nuestros servicios y experiencia del cliente</li>
									<li className="leading-relaxed">Enviar información sobre promociones y ofertas especiales (con su consentimiento)</li>
									<li className="leading-relaxed">Cumplir con obligaciones legales y regulatorias</li>
								</ul>
							</div>
						</div>
					</section>

					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								4
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Protección de la Información
								</h2>
								<div className="space-y-4">
									<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-500">
										<h3 className="font-semibold text-[#3d2817] mb-2">4.1 Medidas de Seguridad</h3>
										<p className="leading-relaxed text-stone-700">
											Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal 
											contra acceso no autorizado, pérdida, destrucción o alteración.
										</p>
									</div>
									<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-500">
										<h3 className="font-semibold text-[#3d2817] mb-2">4.2 Confidencialidad</h3>
										<p className="leading-relaxed text-stone-700">
											Toda la información relacionada con su salud y tratamientos es estrictamente confidencial y solo será compartida 
											con el personal autorizado necesario para brindar el servicio.
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								5
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Compartir Información
								</h2>
								<p className="mb-4 leading-relaxed text-stone-700">
									No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en las siguientes circunstancias:
								</p>
								<ul className="ml-6 list-disc space-y-2 text-stone-700">
									<li className="leading-relaxed">Cuando sea necesario para proporcionar el servicio solicitado (por ejemplo, procesadores de pago)</li>
									<li className="leading-relaxed">Cuando sea requerido por ley o por orden judicial</li>
									<li className="leading-relaxed">Con su consentimiento explícito</li>
									<li className="leading-relaxed">Para proteger nuestros derechos legales o la seguridad de nuestros clientes</li>
								</ul>
							</div>
						</div>
					</section>

					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								6
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Retención de Datos
								</h2>
								<p className="leading-relaxed text-stone-700">
									Conservamos su información personal durante el tiempo necesario para cumplir con los propósitos descritos en esta política, 
									o según lo requiera la ley. Los registros de reservas y tratamientos se conservan por un período razonable para fines administrativos 
									y de atención al cliente.
								</p>
							</div>
						</div>
					</section>

					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								7
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Sus Derechos
								</h2>
								<p className="mb-4 leading-relaxed text-stone-700">
									Usted tiene derecho a:
								</p>
								<ul className="ml-6 list-disc space-y-2 text-stone-700">
									<li className="leading-relaxed">Acceder a su información personal que tenemos en nuestros registros</li>
									<li className="leading-relaxed">Solicitar la corrección de información inexacta o incompleta</li>
									<li className="leading-relaxed">Solicitar la eliminación de su información personal (sujeto a obligaciones legales)</li>
									<li className="leading-relaxed">Oponerse al procesamiento de su información personal para ciertos fines</li>
									<li className="leading-relaxed">Retirar su consentimiento en cualquier momento</li>
								</ul>
								<p className="mt-4 leading-relaxed text-stone-700">
									Para ejercer estos derechos, puede contactarnos a través de los medios indicados en la sección de contacto.
								</p>
							</div>
						</div>
					</section>

					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								8
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Cookies y Tecnologías Similares
								</h2>
								<p className="leading-relaxed text-stone-700">
									Nuestro sitio web puede utilizar cookies y tecnologías similares para mejorar su experiencia de navegación. 
									Puede configurar su navegador para rechazar cookies, aunque esto puede afectar algunas funcionalidades del sitio.
								</p>
							</div>
						</div>
					</section>

					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.9s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								9
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Menores de Edad
								</h2>
								<p className="leading-relaxed text-stone-700">
									Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos intencionalmente información personal 
									de menores de edad sin el consentimiento de sus padres o tutores legales.
								</p>
							</div>
						</div>
					</section>

					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								10
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Cambios a esta Política
								</h2>
								<p className="leading-relaxed text-stone-700">
									Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos sobre cambios significativos publicando 
									la nueva política en nuestro sitio web con la fecha de actualización.
								</p>
							</div>
						</div>
					</section>

					<section className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '1.1s' }}>
						<div className="flex items-start gap-4 mb-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								11
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
									Contacto
								</h2>
								<p className="mb-4 leading-relaxed text-stone-700">
									Si tiene preguntas, preocupaciones o solicitudes relacionadas con esta política de privacidad o el manejo de su información personal, 
									puede contactarnos a través de:
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

					<section className={`bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-100 rounded-3xl p-6 md:p-8 border-2 border-blue-300 shadow-xl relative overflow-hidden ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '1.2s' }}>
						<div className="absolute inset-0 animate-shimmer opacity-30" />
						<div className="relative z-10">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
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
								Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta política de privacidad.
							</p>
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}

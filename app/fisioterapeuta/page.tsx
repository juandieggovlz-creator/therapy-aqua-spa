"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FisioterapeutaAreaPage() {
	const router = useRouter();

	useEffect(() => {
		// Verificar si hay sesión activa
		const token = sessionStorage.getItem('auth_token');
		const user = sessionStorage.getItem('user');
		
		if (token && user) {
			const userData = JSON.parse(user);
			if (userData.role === 'fisio') {
				router.push('/fisioterapeuta/dashboard');
				return;
			}
		}
	}, [router]);

	return (
		<main className="min-h-screen bg-gradient-to-br from-[color:var(--crema-50)] via-stone-50 to-neutral-100 flex items-center justify-center px-4 py-12">
			<div className="max-w-md w-full text-center">
				<div className="bg-white rounded-3xl shadow-2xl p-8 border border-[color:var(--arena-300)]/20">
					<div className="w-16 h-16 bg-gradient-to-br from-[color:var(--oliva-400)] to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
						<span className="text-3xl">👩‍⚕️</span>
					</div>
					<h1 className="text-2xl font-bold text-[color:var(--cafe-900)] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
						Área de Fisioterapeuta
					</h1>
					<p className="text-stone-600 mb-6">
						Accede al dashboard para gestionar tus citas y ver tus métricas
					</p>
					<Link
						href="/login/fisio"
						className="inline-block w-full bg-gradient-to-r from-[color:var(--oliva-400)] to-green-600 hover:from-green-600 hover:to-[color:var(--oliva-400)] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
					>
						Iniciar Sesión
					</Link>
					<div className="mt-6">
						<Link
							href="/"
							className="text-sm text-stone-600 hover:text-[color:var(--cafe-900)] transition-colors inline-flex items-center gap-1"
						>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
								<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
							</svg>
							Volver al inicio
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}



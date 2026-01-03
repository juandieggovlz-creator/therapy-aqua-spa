"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LoginAfiliadosPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [afiliadoNombre, setAfiliadoNombre] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/afiliados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, action: 'login' }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión');
        setIsLoading(false);
        return;
      }

      // Mostrar animación de éxito
      setAfiliadoNombre(data.afiliado.nombre);
      setShowSuccess(true);
      
      // Guardar en sessionStorage
      sessionStorage.setItem('afiliado_token', data.token);
      sessionStorage.setItem('afiliado', JSON.stringify(data.afiliado));

      // Redirigir después de la animación
      setTimeout(() => {
        window.location.href = '/reservas';
      }, 2500);
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-100 flex items-center justify-center py-12 px-4">
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
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes checkmark {
            0% {
              stroke-dashoffset: 100;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
          .animate-scale-in {
            animation: scaleIn 0.5s ease-out forwards;
          }
          .animate-checkmark {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: checkmark 0.8s ease-out forwards;
          }
        `}</style>

        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-scale-in">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <svg className="w-12 h-12 text-white animate-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-green-400 rounded-full animate-ping opacity-20"></div>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-[#3d2817] mb-4 animate-fade-in-up" style={{ fontFamily: "'Playfair Display', serif" }}>
              ¡Bienvenido, {afiliadoNombre}!
            </h2>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-6 border-2 border-amber-200 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-4xl">🏅</span>
                <p className="text-lg font-bold text-[#3d2817]">Eres Afiliado</p>
              </div>
              <p className="text-stone-700 mb-4">
                Accedes a descuentos exclusivos en servicios adicionales
              </p>
              <div className="space-y-2 text-sm text-stone-600">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Descuentos en Sauna, Jacuzzi y Baño Turco</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Paquete de relajación a precio preferencial</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Promociones especiales exclusivas</span>
                </div>
              </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <p className="text-stone-600 mb-4">Redirigiendo a reservas...</p>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-100 relative overflow-hidden flex items-center justify-center py-12 px-4">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay-1 {
          animation: float 6s ease-in-out 2s infinite;
        }
        .animate-float-delay-2 {
          animation: float 6s ease-in-out 4s infinite;
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      {/* Elementos decorativos flotantes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 text-5xl animate-float">🏅</div>
        <div className="absolute top-40 right-20 text-4xl animate-float-delay-1">💎</div>
        <div className="absolute bottom-32 left-1/4 text-4xl animate-float-delay-2">✨</div>
        <div className="absolute top-1/3 right-1/3 text-3xl animate-float">🌟</div>
        <div className="absolute bottom-20 right-10 text-5xl animate-float-delay-1">🎁</div>
      </div>

      {/* Fondos decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6 group">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
              <span className="text-4xl">🏅</span>
            </div>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Portal Afiliados
          </h1>
          <p className="text-amber-700 text-lg font-semibold">
            Accede a tus beneficios exclusivos
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-amber-200 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                📧 Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="afiliado@example.com"
                  required
                  className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-200 rounded-xl text-[#3d2817] placeholder-stone-400 focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                🔒 Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-200 rounded-xl text-[#3d2817] placeholder-stone-400 focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all outline-none pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-500 hover:text-[#3d2817] transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Recordar / Olvidaste */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-stone-600 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-stone-300 bg-stone-50 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer transition-all"
                />
                <span className="group-hover:text-[#3d2817] transition-colors">Recordarme</span>
              </label>
              <button type="button" className="text-amber-700 hover:text-amber-800 transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              {isLoading ? (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>Iniciar Sesión</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-stone-500">¿No tienes cuenta?</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-stone-600 mb-4">¿Eres nuevo afiliado?</p>
            <Link
              href="/registro/afiliados"
              className="inline-block bg-stone-100 hover:bg-stone-200 border-2 border-stone-300 hover:border-amber-400 text-[#3d2817] font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Registrarme ahora
            </Link>
          </div>
        </div>

        {/* Beneficios */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-200">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-xs text-[#3d2817] font-semibold">Descuentos Exclusivos</p>
          </div>
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-200">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-xs text-[#3d2817] font-semibold">Reservas Prioritarias</p>
          </div>
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-200">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">🎁</span>
            </div>
            <p className="text-xs text-[#3d2817] font-semibold">Promociones Especiales</p>
          </div>
        </div>

        {/* Credenciales de prueba */}
        <div className="mt-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🔑</span>
            <p className="text-sm font-bold text-[#3d2817]">Credenciales de prueba:</p>
          </div>
          <div className="bg-white rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-600">Email:</span>
              <span className="text-xs font-mono font-semibold text-[#3d2817] bg-stone-100 px-3 py-1 rounded">afiliado@example.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-600">Contraseña:</span>
              <span className="text-xs font-mono font-semibold text-[#3d2817] bg-stone-100 px-3 py-1 rounded">afiliado123</span>
            </div>
          </div>
        </div>

        {/* Volver al inicio */}
        <div className="text-center mt-8">
          <Link href="/" className="text-stone-600 hover:text-[#3d2817] text-sm transition-colors inline-flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

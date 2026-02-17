"use client";

import React, { useState, useEffect } from 'react';
import { showNotification } from '@/app/components/NotificationSystem';

type Configuracion = {
  id: number;
  clave: string;
  valor: string;
  descripcion: string | null;
  tipo: string;
  categoria: string;
  editable_por_gerente: boolean;
};

type WebContent = {
  id: number;
  key: string;
  title: string;
  content: string;
  image: string | null;
  section: string;
  active: boolean;
};

type FAQ = {
  id: number;
  question: string;
  answer: string;
  order: number;
  active: boolean;
};

const KEY_LABELS: Record<string, string> = {
  // Home
  'home_hero_badge': 'Texto del Banner (Pequeño)',
  'home_hero_title': 'Título principal del inicio',
  'home_hero_subtitle': 'Frase debajo del banner',
  'home_hero_description': 'Texto de bienvenida / introducción',
  'home_metrics_clients': 'Número de clientes felices',
  'home_metrics_services': 'Texto "Terapias especializadas"',
  'home_metrics_rating': 'Calificación promedio',
  // About
  'about_title': 'Título de sección "Sobre Nosotros"',
  'about_subtitle': 'Subtítulo "Sobre Nosotros"',
  'about_description': 'Historia / Descripción de la empresa',
  'about_team_title': 'Nombre del especialista / Equipo',
  'about_team_description': 'Biografía / Experiencia del equipo',
  // Contact & Branding
  'contact_whatsapp': 'Número de WhatsApp',
  'contact_email': 'Correo electrónico de contacto',
  'contact_schedule': 'Horarios de atención',
  'contact_address': 'Dirección / Ubicación',
  'contact_google_maps': 'Link de Google Maps',
  'contact_instagram': 'Link de Instagram',
  'branding_logo': 'URL del Logo del sitio'
};

export default function ContenidoWebTab() {
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'contact' | 'faqs'>('home');
  const [webContent, setWebContent] = useState<WebContent[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [configuraciones, setConfiguraciones] = useState<Configuracion[]>([]);
  const [loading, setLoading] = useState(true);

  // Edición
  const [editandoItem, setEditandoItem] = useState<WebContent | null>(null);
  const [editandoFaq, setEditandoFaq] = useState<FAQ | null>(null);
  const [editandoConfig, setEditandoConfig] = useState<Configuracion | null>(null);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [activeSection]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      if (activeSection === 'home' || activeSection === 'about') {
        const res = await fetch('/api/admin/content');
        const data = await res.json();
        if (data.success) {
          setWebContent(data.content.filter((c: WebContent) => c.section === activeSection));
        }
      } else if (activeSection === 'faqs') {
        const res = await fetch('/api/admin/faqs');
        const data = await res.json();
        if (data.success) setFaqs(data.faqs || []);
      } else if (activeSection === 'contact') {
        const res = await fetch('/api/admin/configuracion');
        const data = await res.json();
        if (data.success) {
          setConfiguraciones(data.configuraciones.filter((c: Configuracion) =>
            c.categoria === 'contacto' || c.categoria === 'branding'
          ));
        }
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      showNotification.error('Error al conectar con el servidor');
    }
    setLoading(false);
  };

  const handleSaveContent = async (item: WebContent) => {
    setBuscando(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        showNotification.success('Contenido actualizado correctamente');
        setEditandoItem(null);
        cargarDatos();
        // Emitir evento para actualizar frontend si está abierto en otra pestaña (opcional)
        window.dispatchEvent(new CustomEvent('actualizarPaginaPrincipal'));
      } else {
        showNotification.error('Error al guardar cambios');
      }
    } catch (error) {
      showNotification.error('Error de conexión');
    }
    setBuscando(false);
  };

  const handleSaveFaq = async (faq: Partial<FAQ>) => {
    setBuscando(true);
    try {
      const method = faq.id ? 'PATCH' : 'POST';
      const res = await fetch('/api/admin/faqs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq)
      });
      if (res.ok) {
        showNotification.success('FAQ guardada con éxito');
        setEditandoFaq(null);
        cargarDatos();
      } else {
        showNotification.error('Error al guardar FAQ');
      }
    } catch (error) {
      showNotification.error('Error de conexión');
    }
    setBuscando(false);
  };

  const handleDeleteFaq = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta pregunta?')) return;
    try {
      const res = await fetch(`/api/admin/faqs?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification.success('FAQ eliminada');
        cargarDatos();
      }
    } catch (error) {
      showNotification.error('Error al eliminar');
    }
  };

  const handleSaveConfig = async (config: Configuracion) => {
    setBuscando(true);
    try {
      const res = await fetch('/api/admin/configuracion', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        showNotification.success('Información actualizada');
        setEditandoConfig(null);
        cargarDatos();
      } else {
        showNotification.error('Error al guardar');
      }
    } catch (error) {
      showNotification.error('Error de conexión');
    }
    setBuscando(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200">
      {/* Header del CMS */}
      <div className="bg-[#3d2817] p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold font-serif">Gestor de Contenido (CMS)</h2>
            <p className="text-amber-200 mt-2 opacity-90">Personaliza cada rincón de tu sitio web en tiempo real</p>
          </div>
          <div className="text-5xl opacity-20">🌐</div>
        </div>

        {/* Tabs de Navegación Profesional */}
        <div className="flex gap-2 p-1 bg-stone-800/50 rounded-xl backdrop-blur-sm self-start inline-flex">
          {[
            { id: 'home', label: '🏠 Inicio', bg: 'bg-amber-600' },
            { id: 'about', label: '👥 Nosotros', bg: 'bg-emerald-600' },
            { id: 'faqs', label: '❓ FAQs', bg: 'bg-blue-600' },
            { id: 'contact', label: '📞 Contacto', bg: 'bg-rose-600' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-6 py-2.5 rounded-lg font-bold transition-all duration-300 ${activeSection === tab.id
                ? `${tab.bg} text-white shadow-lg`
                : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#3d2817]"></div>
            <p className="mt-4 text-stone-500 font-medium animate-pulse">Cargando editor mágico...</p>
          </div>
        ) : (
          <div className="space-y-6">

            {/* EDITOR DE CONTENIDO (HOME / ABOUT) */}
            {(activeSection === 'home' || activeSection === 'about') && (
              <div className="grid grid-cols-1 gap-6">
                {webContent.map(item => (
                  <div key={item.id} className="group bg-stone-50 rounded-2xl p-6 border-2 border-stone-100 hover:border-amber-200 transition-all shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-[#3d2817] text-white text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-widest opacity-50">
                            {item.key}
                          </span>
                        </div>
                        <h4 className="font-bold text-lg text-[#3d2817]">
                          {KEY_LABELS[item.key] || item.title || item.key}
                        </h4>
                      </div>
                      <button
                        onClick={() => setEditandoItem(item)}
                        className="flex-shrink-0 text-amber-700 hover:text-amber-900 font-bold text-sm bg-amber-50 px-4 py-2 rounded-lg transition-colors border border-amber-100 shadow-sm"
                      >
                        ✏️ Editar Contenido
                      </button>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-stone-100 min-h-[60px]">
                      <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap italic">
                        "{item.content || 'Sin contenido...'}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EDITOR DE FAQs */}
            {activeSection === 'faqs' && (
              <div className="space-y-4">
                <button
                  onClick={() => setEditandoFaq({ question: '', answer: '', order: faqs.length + 1 } as FAQ)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105"
                >
                  + Agregar Nueva FAQ
                </button>
                <div className="grid grid-cols-1 gap-4">
                  {faqs.map(faq => (
                    <div key={faq.id} className="bg-white p-6 rounded-2xl border-2 border-stone-100 hover:bg-stone-50 transition-colors shadow-sm">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl flex-shrink-0">🤔</span>
                            <h4 className="font-bold text-[#3d2817] text-lg leading-tight break-words">{faq.question}</h4>
                          </div>
                          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 ml-9">
                            <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap break-words">{faq.answer}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button onClick={() => setEditandoFaq(faq)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 shadow-sm transition-all" title="Editar">✏️</button>
                          <button onClick={() => handleDeleteFaq(faq.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 shadow-sm transition-all" title="Eliminar">🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EDITOR DE CONTACTO & BRANDING */}
            {activeSection === 'contact' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {configuraciones.map(config => (
                  <div key={config.id} className="bg-stone-50 p-6 rounded-2xl border-2 border-stone-100 hover:border-rose-200 transition-all group">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl border border-stone-200 group-hover:bg-rose-50 transition-colors">
                          {config.categoria === 'branding' ? '🖼️' : (
                            config.clave.includes('whatsapp') ? '📱' :
                              config.clave.includes('email') ? '📧' :
                                config.clave.includes('maps') ? '📍' :
                                  config.clave.includes('instagram') ? '📸' : '📞'
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#3d2817]">
                            {KEY_LABELS[config.clave] || config.clave.split('_').pop()?.replace(/-/g, ' ')}
                          </h4>
                          <p className="text-[10px] text-stone-400 font-mono tracking-tighter uppercase">{config.clave}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditandoConfig(config)}
                        className="bg-white text-rose-600 hover:bg-rose-600 hover:text-white px-4 py-2 rounded-lg font-bold text-xs border border-rose-200 shadow-sm transition-all"
                      >
                        ✏️ Editar
                      </button>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-stone-200 text-sm font-medium text-stone-700 break-all min-h-[50px] flex items-center shadow-inner">
                      {config.valor || <span className="text-stone-300 italic">Pendiente de configurar</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL DE EDICIÓN - WebContent */}
      {editandoItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-fade-in-up">
            <div className="bg-[#3d2817] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold font-serif">Modificar Sección</h3>
                <p className="text-xs text-amber-200 opacity-70">Identificador técnico: {editandoItem.key}</p>
              </div>
              <button onClick={() => setEditandoItem(null)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors font-bold w-10 h-10 flex items-center justify-center">✕</button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Etiqueta Administrativa</label>
                <input
                  className="w-full p-4 bg-stone-100 border-2 border-stone-200 rounded-xl focus:border-amber-500 transition-all outline-none opacity-50 cursor-not-allowed"
                  value={KEY_LABELS[editandoItem.key] || editandoItem.title}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Contenido de Texto</label>
                <textarea
                  className="w-full p-4 bg-stone-50 border-2 border-stone-200 rounded-xl h-48 focus:border-amber-500 transition-all outline-none resize-none"
                  value={editandoItem.content}
                  onChange={e => setEditandoItem({ ...editandoItem, content: e.target.value })}
                />
              </div>
              <div className="flex gap-4">
                <button
                  disabled={buscando}
                  onClick={() => handleSaveContent(editandoItem)}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50"
                >
                  {buscando ? 'Guardando...' : '🔥 Guardar Cambios'}
                </button>
                <button
                  onClick={() => setEditandoItem(null)}
                  className="px-8 py-4 bg-stone-100 text-stone-600 rounded-xl font-bold hover:bg-stone-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDICIÓN - FAQ */}
      {editandoFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden transform animate-fade-in-up">
            <div className="bg-blue-900 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold font-serif">{editandoFaq.id ? 'Editar Pregunta' : 'Nueva Pregunta'}</h3>
              <button onClick={() => setEditandoFaq(null)} className="text-stone-400 hover:text-white">✕</button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Pregunta</label>
                <input
                  className="w-full p-4 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-blue-500 outline-none"
                  value={editandoFaq.question}
                  onChange={e => setEditandoFaq({ ...editandoFaq, question: e.target.value })}
                  placeholder="Ej: ¿Qué incluye la terapia?"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Respuesta (Soporta Emojis)</label>
                <textarea
                  className="w-full p-4 bg-stone-50 border-2 border-stone-200 rounded-xl h-40 focus:border-blue-500 outline-none resize-none"
                  value={editandoFaq.answer}
                  onChange={e => setEditandoFaq({ ...editandoFaq, answer: e.target.value })}
                  placeholder="Escribe la respuesta detallada aquí..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  disabled={buscando}
                  onClick={() => handleSaveFaq(editandoFaq)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50"
                >
                  {buscando ? 'Guardando...' : '✓ Guardar FAQ'}
                </button>
                <button
                  onClick={() => setEditandoFaq(null)}
                  className="px-8 py-4 bg-stone-100 text-stone-600 rounded-xl font-bold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDICIÓN - Config */}
      {editandoConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden transform animate-fade-in-up">
            <div className="bg-rose-900 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold font-serif">Editar Información</h3>
              <button onClick={() => setEditandoConfig(null)} className="text-stone-400 hover:text-white">✕</button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  {KEY_LABELS[editandoConfig.clave] || editandoConfig.clave.replace(/_/g, ' ')}
                </label>
                <input
                  className="w-full p-4 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-rose-500 outline-none"
                  value={editandoConfig.valor}
                  onChange={e => setEditandoConfig({ ...editandoConfig, valor: e.target.value })}
                />
                <p className="mt-2 text-xs text-stone-500 italic">{editandoConfig.descripcion}</p>
              </div>
              <div className="flex gap-4">
                <button
                  disabled={buscando}
                  onClick={() => handleSaveConfig(editandoConfig)}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50"
                >
                  {buscando ? 'Actualizar...' : '💾 Actualizar Info'}
                </button>
                <button
                  onClick={() => setEditandoConfig(null)}
                  className="px-8 py-4 bg-stone-100 text-stone-600 rounded-xl font-bold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

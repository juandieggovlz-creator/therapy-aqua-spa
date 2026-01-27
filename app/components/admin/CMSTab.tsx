"use client";

import React, { useState, useEffect } from 'react';
import { showNotification } from '@/app/components/NotificationSystem';

type ContenidoPublico = {
  logo: {
    imagen: string;
    texto: string;
  };
  sobreNosotros: {
    titulo: string;
    subtitulo: string;
    descripcion: string;
    mision: string;
    vision: string;
    valores: string[];
  };
  ubicacion: {
    direccion: string;
    lugar: string;
    ciudad: string;
    mapaEmbed: string;
    mapaLink: string;
    parqueadero: boolean;
    acceso: string;
  };
  contacto: {
    telefono: string;
    email: string;
    whatsapp: string;
    whatsappLink: string;
    horariosAtencion: string;
    mensajeContacto: string;
  };
  horarios: {
    lunes: { abierto: boolean; apertura: string; cierre: string };
    martes: { abierto: boolean; apertura: string; cierre: string };
    miercoles: { abierto: boolean; apertura: string; cierre: string };
    jueves: { abierto: boolean; apertura: string; cierre: string };
    viernes: { abierto: boolean; apertura: string; cierre: string };
    sabado: { abierto: boolean; apertura: string; cierre: string };
    domingo: { abierto: boolean; apertura: string; cierre: string };
  };
  redesSociales: {
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube: string;
    twitter: string;
  };
  banner: {
    imagen: string;
    texto: string;
    textoBoton: string;
    mostrar: boolean;
  };
  secciones: {
    testimonios: { mostrar: boolean; titulo: string };
    serviciosDestacados: { mostrar: boolean; titulo: string };
  };
  anuncio: {
    activo: boolean;
    etiqueta: string;
    titulo: string;
    descripcion: string;
    mostrarBoton: boolean;
    botonTexto: string;
    botonEnlace: string;
  };
  whatsapp: {
    numero: string;
    mensaje: string;
    mostrar: boolean;
  };
  botones: {
    reservar: string;
    verServicios: string;
    contactar: string;
    escribir: string;
  };
  mensajes: {
    urgencia: string;
    campanas: string[];
  };
};

export default function CMSTab() {
  const [contenido, setContenido] = useState<ContenidoPublico | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    loadContenido();
  }, []);

  const loadContenido = async () => {
    try {
      const res = await fetch('/api/admin/cms');
      const data = await res.json();
      // Asegurar que todas las secciones tengan valores por defecto
      setContenido({
        ...data.contenido,
        logo: data.contenido.logo || { imagen: '/image/logo-oficial.jpg', texto: 'Therapy Aqua Spa' },
        sobreNosotros: data.contenido.sobreNosotros || {
          titulo: 'Sobre Nosotros',
          subtitulo: 'Tu Bienestar es Nuestra Prioridad',
          descripcion: '',
          mision: '',
          vision: '',
          valores: []
        },
        ubicacion: data.contenido.ubicacion || {
          direccion: '',
          lugar: '',
          ciudad: '',
          mapaEmbed: '',
          mapaLink: '',
          parqueadero: false,
          acceso: ''
        },
        contacto: data.contenido.contacto || {
          telefono: '',
          email: '',
          whatsapp: '',
          whatsappLink: '',
          horariosAtencion: '',
          mensajeContacto: ''
        },
        horarios: data.contenido.horarios || {
          lunes: { abierto: false, apertura: '08:00', cierre: '16:00' },
          martes: { abierto: false, apertura: '08:00', cierre: '16:00' },
          miercoles: { abierto: false, apertura: '08:00', cierre: '16:00' },
          jueves: { abierto: true, apertura: '08:00', cierre: '16:00' },
          viernes: { abierto: true, apertura: '08:00', cierre: '16:00' },
          sabado: { abierto: true, apertura: '08:00', cierre: '16:00' },
          domingo: { abierto: true, apertura: '08:00', cierre: '16:00' }
        },
        redesSociales: data.contenido.redesSociales || {
          instagram: '',
          facebook: '',
          tiktok: '',
          youtube: '',
          twitter: ''
        }
      });
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      if (data.url && contenido) {
        updateField(['logo', 'imagen'], data.url);
        showNotification.success('Logo subido correctamente');
      }
    } catch (error: any) {
      console.error('Error subiendo logo:', error);
      showNotification.error(`Error al subir logo: ${error.message}`);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    if (!contenido) return;
    setSaving(true);
    try {
      const response = await fetch('/api/admin/cms', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contenido)
      });
      
      if (!response.ok) {
        throw new Error('Error al guardar');
      }
      
      showNotification.success('Contenido actualizado correctamente');

      // Disparar eventos para actualizar la página principal automáticamente
      const timestamp = Date.now();
      localStorage.setItem('cms_actualizado', timestamp.toString());
      localStorage.setItem('necesita_recarga', 'true');
      
      ['cmsActualizado', 'actualizarPaginaPrincipal'].forEach(evento => {
        window.dispatchEvent(new CustomEvent(evento, {
          detail: { timestamp, source: 'admin-cms' },
          bubbles: true,
          cancelable: true
        }));
      });
      
      setTimeout(() => {
        ['cmsActualizado', 'actualizarPaginaPrincipal'].forEach(evento => {
          window.dispatchEvent(new CustomEvent(evento, {
            detail: { timestamp, source: 'admin-cms' },
            bubbles: true,
            cancelable: true
          }));
        });
      }, 100);
      
      setTimeout(() => {
        ['cmsActualizado', 'actualizarPaginaPrincipal'].forEach(evento => {
          window.dispatchEvent(new CustomEvent(evento, {
            detail: { timestamp, source: 'admin-cms' },
            bubbles: true,
            cancelable: true
          }));
        });
      }, 300);
    } catch (error: any) {
      console.error('Error guardando:', error);
      showNotification.error(`Error al guardar contenido: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (path: string[], value: any) => {
    if (!contenido) return;
    const newContenido = { ...contenido };
    let current: any = newContenido;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    
    setContenido(newContenido);
  };

  const addValor = () => {
    if (!contenido) return;
    const nuevosValores = [...(contenido.sobreNosotros.valores || []), ''];
    updateField(['sobreNosotros', 'valores'], nuevosValores);
  };

  const updateValor = (index: number, value: string) => {
    if (!contenido) return;
    const nuevosValores = [...(contenido.sobreNosotros.valores || [])];
    nuevosValores[index] = value;
    updateField(['sobreNosotros', 'valores'], nuevosValores);
  };

  const removeValor = (index: number) => {
    if (!contenido) return;
    const nuevosValores = contenido.sobreNosotros.valores.filter((_, i) => i !== index);
    updateField(['sobreNosotros', 'valores'], nuevosValores);
  };

  if (loading) {
    return <div className="text-center py-8">Cargando contenido...</div>;
  }

  if (!contenido) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#3d2817] mb-2">Gestión de Contenido Web</h2>
          <p className="text-stone-600">Edita el logo, información de contacto, ubicación y contenido del sitio</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-[#3d2817] to-[#2d1f11] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? '💾 Guardando...' : '💾 Guardar Todos los Cambios'}
        </button>
      </div>

      {/* Logo */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-xl font-bold text-[#3d2817] mb-4 flex items-center gap-2">
          <span>🖼️</span> Logo del Sitio
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 border-2 border-stone-300 rounded-lg overflow-hidden bg-stone-50 flex items-center justify-center">
                {contenido.logo.imagen ? (
                  <img
                    src={contenido.logo.imagen}
                    alt="Logo actual"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-stone-400 text-sm">Sin logo</span>
                )}
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                  Subir Nueva Imagen de Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#3d2817] file:text-white file:cursor-pointer hover:file:bg-[#2d1f11] disabled:opacity-50"
                />
                {uploadingLogo && (
                  <p className="text-sm text-blue-600 mt-2">⏳ Subiendo imagen...</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                  URL del Logo (o editar manualmente)
                </label>
                <input
                  type="text"
                  value={contenido.logo.imagen || ''}
                  onChange={(e) => updateField(['logo', 'imagen'], e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
                  placeholder="/image/logo-oficial.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                  Texto Alternativo del Logo
                </label>
                <input
                  type="text"
                  value={contenido.logo.texto || ''}
                  onChange={(e) => updateField(['logo', 'texto'], e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
                  placeholder="Therapy Aqua Spa"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sobre Nosotros */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-xl font-bold text-[#3d2817] mb-4 flex items-center gap-2">
          <span>📄</span> Contenido de "Sobre Nosotros"
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#3d2817] mb-2">Título</label>
            <input
              type="text"
              value={contenido.sobreNosotros.titulo || ''}
              onChange={(e) => updateField(['sobreNosotros', 'titulo'], e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3d2817] mb-2">Subtítulo</label>
            <input
              type="text"
              value={contenido.sobreNosotros.subtitulo || ''}
              onChange={(e) => updateField(['sobreNosotros', 'subtitulo'], e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3d2817] mb-2">Descripción Principal</label>
            <textarea
              value={contenido.sobreNosotros.descripcion || ''}
              onChange={(e) => updateField(['sobreNosotros', 'descripcion'], e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
              placeholder="Descripción general sobre la empresa..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3d2817] mb-2">Misión</label>
            <textarea
              value={contenido.sobreNosotros.mision || ''}
              onChange={(e) => updateField(['sobreNosotros', 'mision'], e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
              placeholder="La misión de la empresa..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3d2817] mb-2">Visión</label>
            <textarea
              value={contenido.sobreNosotros.vision || ''}
              onChange={(e) => updateField(['sobreNosotros', 'vision'], e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
              placeholder="La visión de la empresa..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3d2817] mb-2">Valores</label>
            <div className="space-y-2">
              {(contenido.sobreNosotros.valores || []).map((valor, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={valor}
                    onChange={(e) => updateValor(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
                    placeholder={`Valor ${index + 1}`}
                  />
                  <button
                    onClick={() => removeValor(index)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    ✗
                  </button>
                </div>
              ))}
              <button
                onClick={addValor}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-semibold"
              >
                + Agregar Valor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-xl font-bold text-[#3d2817] mb-4 flex items-center gap-2">
          <span>📍</span> Información de Ubicación
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#3d2817] mb-2">Dirección</label>
            <input
              type="text"
              value={contenido.ubicacion.direccion || ''}
              onChange={(e) => updateField(['ubicacion', 'direccion'], e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
              placeholder="Calle 138 Nro. 55-38"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3d2817] mb-2">Lugar / Edificio</label>
            <input
              type="text"
              value={contenido.ubicacion.lugar || ''}
              onChange={(e) => updateField(['ubicacion', 'lugar'], e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
              placeholder="Círculo de Suboficiales de las Fuerzas Militares"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3d2817] mb-2">Ciudad</label>
            <input
              type="text"
              value={contenido.ubicacion.ciudad || ''}
              onChange={(e) => updateField(['ubicacion', 'ciudad'], e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
              placeholder="Bogotá D.C., Colombia"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#3d2817] mb-2">Enlace de Google Maps</label>
              <input
                type="url"
                value={contenido.ubicacion.mapaLink || ''}
                onChange={(e) => updateField(['ubicacion', 'mapaLink'], e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent text-sm"
                placeholder="https://maps.app.goo.gl/..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#3d2817] mb-2">Código Embed del Mapa</label>
              <input
                type="url"
                value={contenido.ubicacion.mapaEmbed || ''}
                onChange={(e) => updateField(['ubicacion', 'mapaEmbed'], e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent text-sm"
                placeholder="https://www.google.com/maps/embed?..."
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={contenido.ubicacion.parqueadero || false}
                onChange={(e) => updateField(['ubicacion', 'parqueadero'], e.target.checked)}
                className="w-5 h-5 text-[#3d2817] focus:ring-[#3d2817]"
              />
              <span className="font-semibold">Parqueadero disponible</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3d2817] mb-2">Información de Acceso</label>
            <input
              type="text"
              value={contenido.ubicacion.acceso || ''}
              onChange={(e) => updateField(['ubicacion', 'acceso'], e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
              placeholder="Acceso seguro"
            />
          </div>
        </div>
      </div>

      {/* Contacto */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-xl font-bold text-[#3d2817] mb-4 flex items-center gap-2">
          <span>📞</span> Información de Contacto
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#3d2817] mb-2">Teléfono</label>
              <input
                type="tel"
                value={contenido.contacto.telefono || ''}
                onChange={(e) => updateField(['contacto', 'telefono'], e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
                placeholder="+57 301 4185239"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#3d2817] mb-2">Email</label>
              <input
                type="email"
                value={contenido.contacto.email || ''}
                onChange={(e) => updateField(['contacto', 'email'], e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
                placeholder="info@therapyaquaspa.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#3d2817] mb-2">Número de WhatsApp</label>
              <input
                type="tel"
                value={contenido.contacto.whatsapp || ''}
                onChange={(e) => updateField(['contacto', 'whatsapp'], e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
                placeholder="+573014185239"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#3d2817] mb-2">Enlace de WhatsApp</label>
              <input
                type="url"
                value={contenido.contacto.whatsappLink || ''}
                onChange={(e) => updateField(['contacto', 'whatsappLink'], e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent text-sm"
                placeholder="https://wa.link/..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3d2817] mb-2">Mensaje de Contacto</label>
            <textarea
              value={contenido.contacto.mensajeContacto || ''}
              onChange={(e) => updateField(['contacto', 'mensajeContacto'], e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
              placeholder="Estamos aquí para atenderte..."
            />
          </div>
        </div>
      </div>

      {/* Horarios de Atención */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-xl font-bold text-[#3d2817] mb-4 flex items-center gap-2">
          <span>🕐</span> Horarios de Atención
        </h3>
        <p className="text-sm text-stone-600 mb-4">Configura los horarios de atención para cada día de la semana</p>
        <div className="space-y-3">
          {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map((dia) => {
            const diaData = contenido.horarios?.[dia as keyof typeof contenido.horarios] || { abierto: false, apertura: '08:00', cierre: '16:00' };
            const diaLabel = dia.charAt(0).toUpperCase() + dia.slice(1);
            
            return (
              <div key={dia} className="flex items-center gap-4 p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                <div className="w-32 flex-shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={diaData.abierto || false}
                      onChange={(e) => updateField(['horarios', dia, 'abierto'], e.target.checked)}
                      className="w-5 h-5 text-[#3d2817] focus:ring-[#3d2817]"
                    />
                    <span className="font-semibold text-[#3d2817]">{diaLabel}</span>
                  </label>
                </div>
                {diaData.abierto ? (
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-stone-600 mb-1">Apertura</label>
                      <input
                        type="time"
                        value={diaData.apertura || '08:00'}
                        onChange={(e) => updateField(['horarios', dia, 'apertura'], e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent text-sm"
                      />
                    </div>
                    <span className="text-stone-400 font-bold pt-6">-</span>
                    <div className="flex-1">
                      <label className="block text-xs text-stone-600 mb-1">Cierre</label>
                      <input
                        type="time"
                        value={diaData.cierre || '16:00'}
                        onChange={(e) => updateField(['horarios', dia, 'cierre'], e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">Cerrado</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 font-semibold">
            💡 Estos horarios se reflejarán automáticamente en la página de contacto, FAQs y otras secciones del sitio
          </p>
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-xl font-bold text-[#3d2817] mb-4 flex items-center gap-2">
          <span>📱</span> Redes Sociales
        </h3>
        <p className="text-sm text-stone-600 mb-4">Agrega los enlaces de tus redes sociales</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#3d2817] mb-2 flex items-center gap-2">
              <span className="text-xl">📷</span> Instagram
            </label>
            <input
              type="url"
              value={contenido.redesSociales?.instagram || ''}
              onChange={(e) => updateField(['redesSociales', 'instagram'], e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
              placeholder="https://www.instagram.com/therapyaquaspa"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3d2817] mb-2 flex items-center gap-2">
              <span className="text-xl">👥</span> Facebook
            </label>
            <input
              type="url"
              value={contenido.redesSociales?.facebook || ''}
              onChange={(e) => updateField(['redesSociales', 'facebook'], e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
              placeholder="https://www.facebook.com/therapyaquaspa"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3d2817] mb-2 flex items-center gap-2">
              <span className="text-xl">🎵</span> TikTok
            </label>
            <input
              type="url"
              value={contenido.redesSociales?.tiktok || ''}
              onChange={(e) => updateField(['redesSociales', 'tiktok'], e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
              placeholder="https://www.tiktok.com/@therapyaquaspa"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3d2817] mb-2 flex items-center gap-2">
              <span className="text-xl">▶️</span> YouTube
            </label>
            <input
              type="url"
              value={contenido.redesSociales?.youtube || ''}
              onChange={(e) => updateField(['redesSociales', 'youtube'], e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
              placeholder="https://www.youtube.com/@therapyaquaspa"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3d2817] mb-2 flex items-center gap-2">
              <span className="text-xl">🐦</span> Twitter / X
            </label>
            <input
              type="url"
              value={contenido.redesSociales?.twitter || ''}
              onChange={(e) => updateField(['redesSociales', 'twitter'], e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
              placeholder="https://twitter.com/therapyaquaspa"
            />
          </div>
        </div>
        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-xs text-purple-800 font-semibold">
            💡 Los enlaces de redes sociales se mostrarán en el footer y otras secciones del sitio
          </p>
        </div>
      </div>

      {/* Secciones adicionales (mantener las existentes) */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-xl font-bold text-[#3d2817] mb-4">Otras Configuraciones</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-stone-200 rounded-lg">
            <div>
              <p className="font-semibold">Testimonios</p>
              <p className="text-sm text-stone-600">Mostrar sección de testimonios</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={contenido.secciones.testimonios.mostrar}
                onChange={(e) => updateField(['secciones', 'testimonios', 'mostrar'], e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Mostrar</span>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 border border-stone-200 rounded-lg">
            <div>
              <p className="font-semibold">Servicios Destacados</p>
              <p className="text-sm text-stone-600">Mostrar sección de servicios destacados</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={contenido.secciones.serviciosDestacados.mostrar}
                onChange={(e) => updateField(['secciones', 'serviciosDestacados', 'mostrar'], e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Mostrar</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

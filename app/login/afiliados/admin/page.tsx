"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ServiciosTab from '@/app/components/admin/ServiciosTabMejorado';
import PromocionesTab from '@/app/components/admin/PromocionesTab';
import ReservasTab from '@/app/components/admin/ReservasTab';
import ProductosTab from '@/app/components/admin/ProductosTab';
import ServiciosAdicionalesTab from '@/app/components/admin/ServiciosAdicionalesTab';
import ContenidoWebTab from '@/app/components/admin/ContenidoWebTab';

type TabType = 'reservas' | 'servicios' | 'productos' | 'servicios-adicionales' | 'promociones' | 'contenido';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('reservas');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin'>('admin');

  // Verificar autenticación - todos tienen acceso completo
  useEffect(() => {
    const token = sessionStorage.getItem('auth_token');
    const user = sessionStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/login/admin');
      return;
    }

    // Todos los usuarios tienen acceso completo como admin
    setUserRole('admin');
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2817]"></div>
      </div>
    );
  }

  // Pestañas disponibles
  const tabs = [
    { id: 'reservas' as TabType, label: 'Reservas', icon: '📅' },
    { id: 'servicios' as TabType, label: 'Servicios', icon: '🛎️' },
    { id: 'productos' as TabType, label: 'Productos', icon: '📦' },
    { id: 'servicios-adicionales' as TabType, label: 'Servicios Adicionales', icon: '💆' },
    { id: 'promociones' as TabType, label: 'Promociones', icon: '🎁' },
    { id: 'contenido' as TabType, label: 'Contenido Web', icon: '🌐' }
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#3d2817] text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-stone-700 flex items-center justify-between">
          <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>
            Panel de Administración
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-stone-700 rounded"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white'
                  : 'hover:bg-stone-700 text-stone-200'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-700">
          <button
            onClick={() => {
              sessionStorage.removeItem('auth_token');
              sessionStorage.removeItem('user');
              router.push('/login/admin');
            }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-stone-700 text-stone-200"
          >
            <span>🚪</span>
            {sidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-stone-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          {activeTab === 'reservas' && <ReservasTab userRole={userRole} />}
          {activeTab === 'servicios' && <ServiciosTab />}
          {activeTab === 'productos' && <ProductosTab />}
          {activeTab === 'servicios-adicionales' && <ServiciosAdicionalesTab />}
          {activeTab === 'promociones' && <PromocionesTab />}
          {activeTab === 'contenido' && <ContenidoWebTab />}
        </div>
      </main>
    </div>
  );
}

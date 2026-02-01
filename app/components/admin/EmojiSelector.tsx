"use client";

import React, { useState } from 'react';

type EmojiSelectorProps = {
  value: string;
  onChange: (emoji: string) => void;
  category?: 'productos' | 'servicios';
};

const emojisProductos = [
  '📦', '🔒', '👕', '🧴', '🧼', '🧽', '🧹', '🧺', 
  '🛁', '🚿', '🧖', '💆', '🧘', '🕯️', '🪔', '🔥',
  '🌿', '🌸', '🌺', '🌼', '🌻', '🌹', '🍃', '🌾',
  '💐', '🎁', '🎀', '📱', '⌚', '👓', '🥽', '🩱',
  '🧴', '💊', '💉', '🩹', '🩺', '🌡️', '🧪', '🧫',
  '🧬', '🔬', '🔭', '📡', '🔋', '🔌', '💡', '🕯️'
];

const emojisServicios = [
  '💆', '💆‍♂️', '💆‍♀️', '🧖', '🧖‍♂️', '🧖‍♀️', '🧘', '🧘‍♂️',
  '🧘‍♀️', '🛁', '🚿', '💨', '🔥', '❄️', '💧', '💦',
  '🌊', '🏊', '🏊‍♂️', '🏊‍♀️', '🧴', '🧼', '🧽', '🧹',
  '🌿', '🌸', '🌺', '🌼', '🌻', '🌹', '🍃', '💐',
  '✨', '⭐', '🌟', '💫', '🔆', '☀️', '🌤️', '⛅',
  '🎵', '🎶', '🎼', '🎧', '🎤', '🔊', '📻', '🎸',
  '💝', '💖', '💗', '💓', '💞', '💕', '❤️', '🧡'
];

export default function EmojiSelector({ value, onChange, category = 'productos' }: EmojiSelectorProps) {
  const [showSelector, setShowSelector] = useState(false);
  const emojis = category === 'productos' ? emojisProductos : emojisServicios;

  const handleSelect = (emoji: string) => {
    onChange(emoji);
    setShowSelector(false);
  };

  return (
    <div className="relative">
      <div className="flex gap-3">
        {/* Campo de texto con emoji seleccionado */}
        <div 
          className="w-24 h-24 border-2 border-gray-300 rounded-xl bg-white flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all shadow-sm hover:shadow-md"
          onClick={() => setShowSelector(!showSelector)}
        >
          <span className="text-5xl">{value || '📦'}</span>
        </div>

        {/* Botón para abrir selector */}
        <button
          type="button"
          onClick={() => setShowSelector(!showSelector)}
          className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Seleccionar Emoji
        </button>
      </div>

      {/* Selector de emojis - MODAL FULLSCREEN */}
      {showSelector && (
        <>
          {/* Backdrop oscuro */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-[9998] backdrop-blur-sm"
            onClick={() => setShowSelector(false)}
          />

          {/* Panel de emojis centrado */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90vw] max-w-4xl">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl flex items-center gap-2">
                    {category === 'productos' ? '📦 Emojis para Productos' : '💆 Emojis para Servicios'}
                  </h3>
                  <p className="text-sm text-purple-100 mt-1">
                    Haz click en un emoji para seleccionarlo
                  </p>
                </div>
                <button
                  onClick={() => setShowSelector(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Grid de emojis con scroll */}
              <div 
                className="p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white"
                style={{ 
                  maxHeight: '60vh',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#9333ea #f3f4f6'
                }}
              >
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelect(emoji)}
                      className={`
                        aspect-square text-4xl rounded-xl transition-all duration-200
                        flex items-center justify-center
                        ${value === emoji 
                          ? 'bg-purple-600 ring-4 ring-purple-300 scale-110 shadow-xl' 
                          : 'bg-white hover:bg-purple-100 hover:scale-110 hover:shadow-lg border-2 border-gray-200 hover:border-purple-400'
                        }
                      `}
                      title={emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-4 border-t-2 border-purple-200 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    {emojis.length} emojis disponibles
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Seleccionado: <span className="text-2xl ml-2">{value || 'Ninguno'}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowSelector(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-bold transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Estilos personalizados para el scroll */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 12px;
        }
        div::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb {
          background: #9333ea;
          border-radius: 10px;
          border: 2px solid #f3f4f6;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #7e22ce;
        }
      `}</style>
    </div>
  );
}


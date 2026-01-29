import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Therapy Aqua Spa - Fisioterapia y Bienestar en Bogotá',
  description: 'Fisioterapia profesional y masajes terapéuticos en el corazón de Bogotá. Transformamos tu dolor en bienestar, tu tensión en paz.',
  keywords: 'fisioterapia, masajes, terapia, spa, bienestar, Bogotá, lesiones, relajación',
  authors: [{ name: 'Therapy Aqua Spa' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3d2817',
  openGraph: {
    title: 'Therapy Aqua Spa - Fisioterapia y Bienestar',
    description: 'Fisioterapia profesional y masajes terapéuticos en Bogotá',
    type: 'website',
    locale: 'es_CO',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}


-- Migración: Agregar columnas para servicios adicionales individuales
-- Fecha: 2026-01-29

-- Agregar columna es_afiliado si no existe
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS es_afiliado BOOLEAN DEFAULT false;

-- Agregar columna duracion_total si no existe
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS duracion_total INTEGER DEFAULT 0;

-- Verificar que las columnas se crearon
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'reservas' 
AND column_name IN ('es_afiliado', 'duracion_total');



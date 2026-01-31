-- Script para actualizar las rutas de imágenes de servicios existentes
-- Ejecutar este script en Neon para agregar la ruta /image/ a las imágenes que no la tengan

-- Ver las imágenes actuales
SELECT servicio_id, nombre, imagen FROM servicios;

-- Actualizar imágenes que no tengan la ruta completa
-- Solo actualiza si la imagen no está vacía y no empieza con http o /
UPDATE servicios 
SET imagen = '/image/' || imagen,
    updated_at = NOW()
WHERE imagen IS NOT NULL 
  AND imagen != '' 
  AND imagen NOT LIKE 'http%' 
  AND imagen NOT LIKE '/%';

-- Verificar las actualizaciones
SELECT servicio_id, nombre, imagen FROM servicios;

-- Si las imágenes tienen nombres con espacios, también puedes URL-encodearlas manualmente
-- Por ejemplo, cambiar "therapy lesiones de columna 2.jpg" a "/image/therapy%20lesiones%20de%20columna%202.jpg"

-- Ejemplos específicos (ajusta según tus datos reales):
-- UPDATE servicios SET imagen = '/image/therapy%20lesiones%20de%20columna%202.jpg' WHERE servicio_id = 'srv_columna';
-- UPDATE servicios SET imagen = '/image/masaje-deportivo.jpg' WHERE servicio_id = 'srv_deportivo';



# 🖼️ Guía para Solucionar y Gestionar Imágenes

## ⚠️ Problema Actual: Imágenes No Se Ven

Las imágenes no se están mostrando porque:
1. Los servicios en la base de datos tienen rutas de imagen incompletas
2. Faltan las imágenes en la carpeta `/public/image/`

---

## ✅ Solución Paso a Paso

### Paso 1: Actualizar Rutas de Imágenes en la Base de Datos

Ejecuta este script SQL en tu base de datos Neon:

```sql
-- Actualizar todas las rutas de imágenes para que tengan el formato correcto
UPDATE servicios 
SET imagen = '/image/' || imagen,
    updated_at = NOW()
WHERE imagen IS NOT NULL 
  AND imagen != '' 
  AND imagen NOT LIKE 'http%' 
  AND imagen NOT LIKE '/%';
```

O también puedes usar el script completo:
```bash
psql 'postgresql://neondb_owner:npg_0XpsqOZxHe8j@ep-hidden-base-ahbw7ayi-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require' < scripts/actualizar-imagenes-servicios.sql
```

### Paso 2: Verificar Imágenes en la Carpeta `/public/image/`

Las imágenes deben estar en:
```
therapy-aqua-spa/
└── public/
    └── image/
        ├── therapy lesiones de columna 2.jpg
        ├── lesiones de brazo.jpg
        ├── masaje de piernas.jpg
        └── ... (otras imágenes)
```

---

## 🎨 Cómo Agregar Imágenes a los Servicios

### Opción 1: Desde el Panel Admin (Recomendado)

1. **Ir al Panel Admin:**
   - Navegar a `/login/admin`
   - Ingresar credenciales
   - Ir a tab "Servicios"

2. **Editar un Servicio:**
   - Click en "✏️ Editar" en el servicio
   - En el formulario, buscar el campo "Imagen"

3. **Agregar URL de Imagen:**
   
   **Opción A - URL Completa:**
   ```
   /image/nombre-del-archivo.jpg
   ```
   
   **Opción B - Solo Nombre del Archivo:**
   ```
   nombre-del-archivo.jpg
   ```
   El sistema agregará automáticamente `/image/` al inicio.
   
   **Opción C - URL Externa:**
   ```
   https://ejemplo.com/mi-imagen.jpg
   ```

4. **Guardar Cambios:**
   - Click en "Guardar"
   - La imagen se mostrará automáticamente

### Opción 2: Subir Imagen desde el Formulario (Funcionalidad de Upload)

El sistema tiene un endpoint `/api/admin/upload-image` para subir imágenes:

1. **Desde el panel admin:**
   - Editar servicio
   - Click en "Subir Imagen" (si está disponible)
   - Seleccionar archivo
   - La imagen se subirá a `/public/image/`
   - La URL se guardará automáticamente

### Opción 3: Agregar Imágenes Manualmente

1. **Copiar imagen a la carpeta:**
   ```bash
   # Copiar tu imagen a:
   public/image/tu-imagen.jpg
   ```

2. **Actualizar en la base de datos:**
   ```sql
   UPDATE servicios 
   SET imagen = '/image/tu-imagen.jpg' 
   WHERE servicio_id = 'srv_xxx';
   ```

   O desde el panel admin:
   - Editar servicio
   - En campo "Imagen" escribir: `/image/tu-imagen.jpg`
   - Guardar

---

## 📋 Formato de Nombres de Archivo

### ✅ Nombres Recomendados (sin espacios):
```
masaje-deportivo.jpg
terapia-columna.jpg
lesiones-brazo.jpg
```

### ⚠️ Nombres con Espacios (requieren encoding):
Si el archivo tiene espacios, el sistema los codificará automáticamente:
```
Archivo: therapy lesiones de columna 2.jpg
URL guardada: /image/therapy%20lesiones%20de%20columna%202.jpg
```

---

## 🔍 Verificar que las Imágenes Funcionan

### Método 1: Desde el Navegador

Abre en tu navegador:
```
http://localhost:3000/image/nombre-de-tu-imagen.jpg
```

Si la imagen se ve, la ruta es correcta.

### Método 2: Desde el Panel Admin

1. Ir a tab "Servicios"
2. Buscar el servicio
3. Ver si aparece la imagen en la tarjeta
4. Si aparece el icono emoji en lugar de la imagen, significa que la ruta no es correcta

### Método 3: Consola del Navegador (F12)

Si una imagen no carga, verás en la consola:
```
❌ Error cargando imagen: nombre-archivo.jpg
❌ Ruta intentada: /image/nombre-archivo.jpg
```

Esto te indica cuál es la ruta que está intentando cargar.

---

## 🛠️ Solución de Problemas

### Problema: "La imagen no se ve, solo aparece el emoji"

**Causas posibles:**
1. La imagen no existe en `/public/image/`
2. La ruta en la base de datos es incorrecta
3. El nombre del archivo no coincide

**Solución:**
1. Verificar que el archivo exista en `/public/image/`
2. Verificar que el nombre sea exactamente igual (mayúsculas/minúsculas importan)
3. En el panel admin, editar el servicio y actualizar la URL de la imagen

### Problema: "Error 404 al cargar la imagen"

**Causas posibles:**
1. El archivo no existe
2. La carpeta `/public/image/` no existe
3. El nombre tiene caracteres especiales no codificados

**Solución:**
1. Crear la carpeta si no existe:
   ```bash
   mkdir -p public/image
   ```
2. Copiar tus imágenes a esa carpeta
3. Actualizar las URLs en la base de datos

### Problema: "Las imágenes funcionan en local pero no en Vercel"

**Causas posibles:**
1. Las imágenes no están en el repositorio de Git
2. La carpeta está en `.gitignore`

**Solución:**
1. Verificar que `/public/image/` NO esté en `.gitignore`
2. Hacer commit de las imágenes:
   ```bash
   git add public/image/
   git commit -m "Add service images"
   git push
   ```

---

## 📦 Estructura de Carpetas para Imágenes

```
therapy-aqua-spa/
├── public/
│   └── image/
│       ├── servicios/                    # Imágenes de servicios
│       │   ├── terapia-columna.jpg
│       │   ├── masaje-deportivo.jpg
│       │   └── ...
│       ├── productos/                    # Imágenes de productos
│       │   ├── aceite-masaje.jpg
│       │   └── ...
│       └── general/                      # Imágenes generales
│           ├── logo.png
│           ├── banner-principal.jpg
│           └── ...
```

---

## 🎯 Checklist de Verificación

Antes de desplegar a producción, verifica:

- [ ] Todas las imágenes están en `/public/image/`
- [ ] Los nombres de archivo no tienen espacios (o están URL-encoded)
- [ ] Las rutas en la base de datos empiezan con `/image/`
- [ ] Las imágenes se ven correctamente en el panel admin
- [ ] Las imágenes se ven en la página principal
- [ ] Las imágenes se ven en la página `/servicios`
- [ ] Las imágenes están en el repositorio de Git
- [ ] El build de Vercel incluye las imágenes

---

## 💡 Consejos

1. **Usa nombres descriptivos:**
   - ✅ `masaje-relajante-espalda.jpg`
   - ❌ `img1.jpg`

2. **Optimiza el tamaño de las imágenes:**
   - Dimensiones recomendadas: 800x600px
   - Formato recomendado: JPG o WebP
   - Peso máximo recomendado: 200KB

3. **Mantén una estructura organizada:**
   - Separa imágenes de servicios, productos y general
   - Usa subcarpetas cuando tengas muchas imágenes

4. **Haz backup de tus imágenes:**
   - Guarda una copia de todas las imágenes en otro lugar
   - No dependas solo del repositorio

---

## ✅ Resultado Esperado

Después de seguir estos pasos:

1. ✅ Las imágenes se verán en el panel de administración
2. ✅ Las imágenes se verán en la página principal
3. ✅ Las imágenes se verán en `/servicios`
4. ✅ Al agregar un nuevo servicio con imagen, esta se mostrará correctamente
5. ✅ El sistema manejará automáticamente diferentes formatos de ruta de imagen




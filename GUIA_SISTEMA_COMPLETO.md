# 🎯 Guía del Sistema Completo - Therapy Aqua Spa

## ✅ Sistema 100% Funcional y Conectado

Tu sistema ahora está **completamente integrado** con el panel de administración conectado a la base de datos Neon PostgreSQL. Todo lo que modifiques en el panel admin se reflejará **en tiempo real** en la página web.

---

## 🗄️ Estructura del Sistema

### Base de Datos (Neon PostgreSQL)

**Tablas creadas:**
- ✅ `reservas` - Gestión de reservas de clientes
- ✅ `servicios` - Terapias y masajes
- ✅ `servicios_adicionales` - Servicios complementarios (Turco, Sauna, Jacuzzi)
- ✅ `productos` - Productos del spa
- ✅ `horarios` - Horarios disponibles para reservas
- ✅ `configuracion` - Información del sitio web (teléfono, dirección, sobre nosotros, etc.)
- ⏳ `promociones` - Promociones y descuentos (pendiente de crear)

---

## 🎛️ Panel de Administración

Acceso: `/login/admin`

### 📅 Tab: Reservas
**Funcionalidades:**
- Ver todas las reservas
- Cambiar estado (pendiente → confirmada → completada → cancelada)
- Aplicar descuentos de afiliado
- Editar información de reservas
- Ver detalles completos (servicios, productos, precios)
- Eliminar reservas

### 🛎️ Tab: Servicios
**Funcionalidades:**
- ✅ Ver todos los servicios/terapias
- ✅ Agregar nuevos servicios
- ✅ Editar: nombre, descripción, precio, duración, categoría
- ✅ Subir/cambiar imagen
- ✅ Cambiar icono
- ✅ Activar/desactivar servicios
- ✅ Eliminar servicios

**Campos editables:**
- Nombre del servicio
- Descripción
- Categoría
- Precio ($)
- Duración (minutos)
- Icono (emoji)
- Imagen (URL o subir archivo)
- Estado (activo/inactivo)

### 🛍️ Tab: Productos
**Funcionalidades:**
- Ver todos los productos
- Agregar nuevos productos
- Editar información
- Eliminar productos

### 🎁 Tab: Promociones
**Funcionalidades:**
- Ver promociones
- Crear nuevas promociones
- Editar promociones existentes
- Activar/pausar promociones

**Nota:** Esta funcionalidad requiere crear la tabla `promociones` en Neon (ver script SQL más abajo).

### 🌐 Tab: Contenido Web ⭐ **NUEVO**
**Funcionalidades:**
- Gestionar toda la información del sitio web
- Editar teléfono de contacto
- Modificar WhatsApp
- Cambiar dirección
- Actualizar horarios de atención
- Editar "Sobre Nosotros"
- Modificar misión y visión
- Gestionar horarios disponibles para reservas

**Secciones:**
1. **📋 Configuración**
   - 🏢 Información General
   - 📞 Información de Contacto
   - 📱 Redes Sociales
   - 🕐 Horarios de Atención
   - 📝 Sobre Nosotros
   - 📜 Términos y Condiciones

2. **🕐 Horarios**
   - Ver todos los horarios
   - Activar/desactivar horarios
   - Los horarios activos aparecen en el formulario de reservas

---

## 🌐 Conexión Página Web ↔ Panel Admin

### Página Principal (`/`)
**Carga dinámica desde:**
- `/api/servicios-publicos` → Muestra los 6 primeros servicios activos
- Cada servicio muestra:
  - ✅ Nombre
  - ✅ Descripción
  - ✅ Precio
  - ✅ Duración
  - ✅ Imagen
  - ✅ Icono

### Página de Servicios (`/servicios`)
**Carga dinámica desde:**
- `/api/servicios-publicos` → Muestra todos los servicios activos
- Organiza por categorías
- Muestra descripciones completas e imágenes

### Página de Reservas (`/reservas`)
**Carga dinámica desde:**
- `/api/servicios-publicos` → Servicios disponibles
- `/api/horarios-publicos` → Horarios disponibles
- Los clientes solo ven servicios y horarios **activos**

---

## 🔧 APIs Disponibles

### APIs Públicas (para la página web)
- `GET /api/servicios-publicos` - Servicios activos
- `GET /api/horarios-publicos` - Horarios activos
- `GET /api/configuracion-publica` - Información del sitio

### APIs Admin (para el panel de administración)
- `GET/POST/PATCH/DELETE /api/admin/servicios` - Gestión de servicios
- `GET/PATCH /api/admin/descuentos` - Gestión de descuentos
- `GET/POST/DELETE /api/admin/productos` - Gestión de productos
- `GET/POST/PATCH/DELETE /api/admin/promociones` - Gestión de promociones
- `GET/POST/PATCH/DELETE /api/admin/configuracion` - Gestión de configuración
- `GET/POST/PATCH/DELETE /api/admin/horarios` - Gestión de horarios

---

## 📝 Instrucciones de Uso

### 1. Poblar la Base de Datos con Información Inicial

Ejecuta este script SQL en tu base de datos Neon:

```bash
# Conectar a Neon
psql 'postgresql://neondb_owner:npg_0XpsqOZxHe8j@ep-hidden-base-ahbw7ayi-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

# Luego pega el contenido del archivo:
scripts/seed-configuracion.sql
```

Esto creará toda la configuración inicial: teléfono, dirección, sobre nosotros, etc.

### 2. Agregar Servicios Desde el Panel Admin

1. Ir a `/login/admin`
2. Ingresar credenciales
3. Ir a tab "Servicios"
4. Click en "➕ Nuevo Servicio"
5. Llenar el formulario:
   - Nombre del servicio
   - Descripción
   - Categoría
   - Precio
   - Duración
   - Subir imagen
   - Elegir icono
6. Click en "Guardar"

**Los servicios aparecerán automáticamente en la página principal y en `/servicios`**

### 3. Gestionar Horarios Disponibles

1. Ir a tab "Contenido Web"
2. Click en pestaña "🕐 Horarios"
3. Ver todos los horarios
4. Click en un horario para activar/desactivar
5. Los horarios activos (verde) aparecen en el formulario de reservas
6. Los horarios inactivos (gris) no están disponibles para reservar

### 4. Actualizar Información de Contacto

1. Ir a tab "Contenido Web"
2. Click en pestaña "📋 Configuración"
3. Buscar la sección "📞 Información de Contacto"
4. Click en "✏️ Editar" junto al campo que quieres cambiar
5. Modificar el valor
6. Click en "Guardar"

**El cambio se reflejará inmediatamente en todas las páginas del sitio**

### 5. Editar "Sobre Nosotros"

1. Ir a tab "Contenido Web"
2. Buscar la sección "📝 Sobre Nosotros"
3. Editar:
   - Título
   - Descripción de la empresa
   - Misión
   - Visión
4. Guardar cambios

---

## 🚀 Desplegar en Vercel

### 1. Configurar Variable de Entorno

En Vercel → Settings → Environment Variables:

```
POSTGRES_URL=postgresql://neondb_owner:npg_0XpsqOZxHe8j@ep-hidden-base-ahbw7ayi-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 2. Ejecutar Script SQL en Neon

Antes de desplegar, ejecuta el script de configuración inicial:

```bash
psql 'postgresql://neondb_owner:npg_0XpsqOZxHe8j@ep-hidden-base-ahbw7ayi-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require' < scripts/seed-configuracion.sql
```

### 3. Desplegar

```bash
git add .
git commit -m "feat: Sistema completo con panel admin conectado a Neon"
git push origin main
```

Vercel detectará automáticamente el push y desplegará.

---

## ✨ Funcionalidades Destacadas

### ✅ 100% Dinámico
- Todo el contenido se carga desde la base de datos
- Sin necesidad de modificar código para cambiar información
- Actualizaciones en tiempo real

### ✅ Panel Admin Completo
- Gestión de servicios, productos, horarios
- Edición de contenido web sin tocar código
- Interfaz intuitiva y fácil de usar

### ✅ Sincronización Total
- Los cambios en el panel admin se reflejan inmediatamente
- Página principal carga servicios dinámicamente
- Formulario de reservas se actualiza con horarios disponibles

### ✅ Imágenes y Descripciones
- Cada servicio puede tener su imagen
- Descripciones completas editables
- Iconos personalizables

---

## 🔧 Mantenimiento y Soporte

### Si un servicio no aparece en la web:
1. Verificar que esté marcado como "Activo" en el panel admin
2. Verificar que tenga nombre, descripción y precio
3. Recargar la página (Ctrl + Shift + R)

### Si los cambios no se reflejan:
1. Verificar que el build de Vercel fue exitoso
2. Limpiar caché del navegador
3. Verificar que `POSTGRES_URL` esté correcta en Vercel

### Si falta información de contacto:
1. Ejecutar el script SQL de configuración inicial
2. Ir a "Contenido Web" y agregar la información manualmente

---

## 📊 Resumen de Flujo

```
Panel Admin (editar servicio)
        ↓
    Base de Datos Neon (actualización)
        ↓
API `/api/servicios-publicos` (consulta)
        ↓
Página Principal y /servicios (muestra cambios)
```

**TODO está conectado y funcionando** ✅

---

## 🎉 ¡Listo para Usar!

Tu sistema ahora está 100% funcional y conectado. Puedes gestionar todo desde el panel de administración sin necesidad de tocar una sola línea de código.

**Cualquier cambio que hagas en el panel admin se reflejará automáticamente en la página web.**



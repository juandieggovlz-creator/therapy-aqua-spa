# Despliegue en Vercel con Neon Database

Este documento explica cómo desplegar la aplicación Therapy Aqua Spa en Vercel utilizando Neon como base de datos PostgreSQL.

## 🗄️ Base de Datos: Neon PostgreSQL

La aplicación utiliza **Neon PostgreSQL** como base de datos en producción. Todas las tablas y funcionalidades están configuradas para trabajar con Prisma ORM.

### Tablas en Neon

El sistema incluye las siguientes tablas:

- **`reservas`** - Reservas de clientes
- **`servicios`** - Terapias y masajes disponibles
- **`servicios_adicionales`** - Servicios complementarios (Turco, Sauna, Jacuzzi)
- **`productos`** - Productos del spa
- **`promociones`** - Promociones y descuentos
- **`horarios`** - Horarios disponibles
- **`configuracion`** - Configuración general del sistema

## 📋 Pasos para Desplegar en Vercel

### 1. Preparar la Base de Datos en Neon

Tu cadena de conexión de Neon es:
```
postgresql://neondb_owner:npg_0XpsqOZxHe8j@ep-hidden-base-ahbw7ayi-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 2. Aplicar Migraciones de Prisma

Antes de desplegar, asegúrate de que todas las tablas estén creadas en Neon:

```bash
# Aplicar migraciones a la base de datos de producción
npx prisma migrate deploy

# Verificar que todo esté sincronizado
npx prisma db push
```

### 3. Configurar Variables de Entorno en Vercel

Ve a tu proyecto en Vercel → Settings → Environment Variables y agrega:

**Variable requerida:**
```
POSTGRES_URL=postgresql://neondb_owner:npg_0XpsqOZxHe8j@ep-hidden-base-ahbw7ayi-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Importante:** Asegúrate de seleccionar que esta variable esté disponible en:
- ✅ Production
- ✅ Preview
- ✅ Development

### 4. Verificar el archivo `package.json`

El archivo `package.json` debe incluir el script `postinstall`:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

Esto asegura que el cliente de Prisma se genere automáticamente en cada deploy.

### 5. Hacer Push a GitHub/GitLab

```bash
git add .
git commit -m "feat: Agregar APIs de admin con Prisma + Neon"
git push origin main
```

Vercel detectará automáticamente el push y comenzará el despliegue.

## ✅ Verificación Post-Despliegue

Una vez desplegado, verifica que todo funcione:

### 1. Panel de Administración

Ve a: `https://tu-dominio.vercel.app/login/admin`

- **Usuario:** admin (o el que hayas configurado)
- **Contraseña:** (tu contraseña de admin)

### 2. Funcionalidades del Panel Admin

El panel de administración debe permitir:

✅ **Reservas:**
- Ver todas las reservas
- Cambiar estado (pendiente, confirmada, cancelada, completada)
- Aplicar descuentos de afiliado
- Editar información de reservas
- Eliminar reservas

✅ **Servicios:**
- Ver todos los servicios/terapias
- Agregar nuevos servicios
- Editar nombre, descripción, precio, duración
- Cambiar icono e imagen
- Activar/desactivar servicios
- Marcar como destacado
- Aplicar descuentos individuales

✅ **Productos:**
- Ver todos los productos
- Agregar nuevos productos
- Editar información
- Eliminar productos

✅ **Promociones:**
- Ver todas las promociones
- Crear nuevas promociones
- Editar promociones existentes
- Activar/pausar promociones
- Eliminar promociones

## 🔧 APIs Disponibles

Todas las APIs están en `/api/admin/`:

### Servicios
- `GET /api/admin/servicios` - Obtener todos los servicios
- `POST /api/admin/servicios` - Crear servicio
- `PATCH /api/admin/servicios` - Actualizar servicio
- `DELETE /api/admin/servicios?id=xxx` - Eliminar servicio

### Descuentos
- `GET /api/admin/descuentos` - Obtener descuentos
- `PATCH /api/admin/descuentos` - Actualizar descuento

### Productos
- `GET /api/admin/productos` - Obtener productos
- `POST /api/admin/productos` - Crear producto
- `DELETE /api/admin/productos?id=xxx` - Eliminar producto

### Promociones
- `GET /api/admin/promociones` - Obtener promociones
- `POST /api/admin/promociones` - Crear promoción
- `PATCH /api/admin/promociones` - Actualizar promoción
- `DELETE /api/admin/promociones?id=xxx` - Eliminar promoción

## 🚨 Solución de Problemas

### Error: "Cannot find module '@prisma/client'"

**Solución:**
1. Verifica que `postinstall: "prisma generate"` esté en `package.json`
2. Redeploy el proyecto en Vercel
3. Verifica que `@prisma/client` y `prisma` estén en `dependencies` (no en `devDependencies`)

### Error: "Invalid connection string"

**Solución:**
1. Verifica que `POSTGRES_URL` esté correctamente configurada en Vercel
2. Asegúrate de que la URL incluya `?sslmode=require`
3. Verifica que no haya espacios o caracteres extra en la variable

### Error: "Table does not exist"

**Solución:**
1. Ejecuta las migraciones: `npx prisma migrate deploy`
2. O fuerza la sincronización: `npx prisma db push`

### Los cambios en el panel admin no se reflejan

**Solución:**
1. Verifica que estés en el branch correcto (`Therapy-Aqua-Spa` o `prueba-nueva`)
2. Asegúrate de que Vercel esté deployando el branch correcto
3. Limpia la caché de Vercel: Settings → Functions → Clear Cache

## 📞 Información de Contacto

La aplicación está configurada con:
- **WhatsApp:** +57 301 4185239
- **Enlace:** https://wa.me/573014185239

Estos valores se actualizan desde el panel de administración o directamente en la base de datos (tabla `configuracion`).

## 🎯 Resumen

1. ✅ Base de datos Neon PostgreSQL configurada
2. ✅ Prisma ORM para todas las operaciones
3. ✅ APIs REST para el panel de administración
4. ✅ Sistema de reservas funcional
5. ✅ Gestión dinámica de servicios, productos y promociones
6. ✅ Todo sincronizado en tiempo real con Neon

Cuando despliegues en Vercel, todo funcionará automáticamente siempre que la variable `POSTGRES_URL` esté correctamente configurada.


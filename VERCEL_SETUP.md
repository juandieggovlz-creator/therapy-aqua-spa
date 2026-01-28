# 🚀 Configuración de Vercel KV + Postgres

Esta guía te ayudará a configurar el almacenamiento persistente para tu aplicación en Vercel.

## 📋 **Resumen**

Tu aplicación ahora soporta **dos modos**:

1. **Desarrollo Local**: Usa archivos JSON (`data/content.json`, `data/reservas.json`)
2. **Producción (Vercel)**: Usa Vercel KV (Redis) + Vercel Postgres

El sistema detecta automáticamente qué modo usar según las variables de entorno.

---

## 🔧 **Paso 1: Configurar Redis**

### **¿Para qué sirve?**
Almacena el contenido del sitio (servicios, productos, promociones, CMS).

### **Ya lo tienes configurado! ✅**

Ya tienes tu Redis URL de Redis Labs:
```
REDIS_URL="redis://default:nlT4SNjSCng3NQKaNDRb9StbxF81qg6c@redis-19740.c266.us-east-1-3.ec2.cloud.redislabs.com:19740"
```

### **Agrégala a Vercel:**

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. **Settings → Environment Variables**
3. Agrega:
   - **Name**: `REDIS_URL`
   - **Value**: `redis://default:nlT4SNjSCng3NQKaNDRb9StbxF81qg6c@redis-19740.c266.us-east-1-3.ec2.cloud.redislabs.com:19740`
   - Marca: **Production**, **Preview**, **Development**
4. Haz clic en **"Save"**

---

## 🗄️ **Paso 2: Crear Vercel Postgres**

### **¿Para qué sirve?**
Almacena las reservas con queries complejas y prevención de conflictos de horarios.

### **Cómo configurarlo:**

1. En el mismo panel de Storage, haz clic en **"Create Database"** nuevamente
2. Selecciona **"Postgres"**
3. Nombra tu base de datos (ej: `therapy-aqua-db`)
4. Haz clic en **"Create"**

### **Variables de entorno:**

Vercel te mostrará estas variables. Cópialas y agrégalas en **Settings → Environment Variables**:

```env
POSTGRES_URL=postgres://...
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...
POSTGRES_USER=...
POSTGRES_HOST=...
POSTGRES_PASSWORD=...
POSTGRES_DATABASE=...
```

---

## 📊 **Paso 3: Migrar Datos Existentes**

Una vez configuradas las variables de entorno en Vercel, necesitas migrar tus datos:

### **Opción A: Desde tu computadora (recomendado)**

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Copia todas las variables de Vercel (KV + Postgres)
3. Ejecuta el script de migración:

```bash
npm run migrate
```

Este script:
- ✅ Lee `data/content.json` y lo sube a Vercel KV
- ✅ Lee `data/reservas.json` y lo sube a Vercel Postgres
- ✅ Crea las tablas necesarias automáticamente

### **Opción B: Manualmente desde Vercel**

1. Crea un deployment temporal
2. En Vercel Dashboard, ve a **Deployments**
3. Busca el deployment más reciente
4. Haz clic en **"..."** → **"Run Command"**
5. Ejecuta: `npm run migrate`

---

## ✅ **Paso 4: Verificar que Funciona**

Después de la migración:

1. Ve a tu sitio en producción (ej: `therapy-aqua-spa.vercel.app`)
2. Intenta crear una reserva
3. Ve al panel admin y verifica que los servicios se muestran
4. Edita un servicio desde el admin
5. Verifica que los cambios se reflejan en el sitio

Si todo funciona, ¡listo! 🎉

---

## 🐛 **Solución de Problemas**

### **Error: "EROFS: read-only file system"**

**Causa**: Las variables de entorno no están configuradas en Vercel.

**Solución**:
1. Ve a Vercel Dashboard → tu proyecto → Settings → Environment Variables
2. Asegúrate de que todas las variables estén configuradas
3. Redeploy el proyecto

### **Error: "relation 'reservas' does not exist"**

**Causa**: La tabla de reservas no se ha creado en Postgres.

**Solución**:
1. Ejecuta: `npm run migrate` (esto crea las tablas automáticamente)
2. O manualmente ejecuta el script de inicialización

### **Los cambios no se reflejan en el sitio**

**Causa**: El polling del frontend no está funcionando o hay un error de caché.

**Solución**:
1. Verifica que el endpoint `/api/content` funcione correctamente
2. Revisa los logs en Vercel para ver si hay errores
3. Haz un hard refresh (Ctrl+Shift+R o Cmd+Shift+R)

---

## ⚠️ **Nota sobre Deprecación**

Los paquetes `@vercel/kv` y `@vercel/postgres` están deprecated. Vercel recomienda migrar a:

- **Upstash Redis** (reemplazo de Vercel KV)
- **Neon Postgres** (reemplazo de Vercel Postgres)

Puedes migrar más adelante cuando sea necesario. La implementación actual seguirá funcionando.

---

## 📞 **¿Necesitas Ayuda?**

Si tienes problemas, revisa:

1. **Logs de Vercel**: Dashboard → Deployments → [tu deployment] → Function Logs
2. **Variables de entorno**: Dashboard → Settings → Environment Variables
3. **Estado de las bases de datos**: Dashboard → Storage

---

## 🎯 **Resumen de Archivos Modificados**

### **Nuevos archivos:**
- `lib/kv.ts` - Utilidades para Vercel KV
- `lib/db.ts` - Utilidades para Vercel Postgres
- `lib/content-helpers.ts` - Helpers compartidos para contenido
- `lib/reservas-helpers.ts` - Helpers compartidos para reservas
- `scripts/migrate-to-vercel.ts` - Script de migración

### **Archivos actualizados:**
- `app/api/content/route.ts` - Usa KV con fallback a JSON
- `app/api/admin/servicios/route.ts` - Usa helpers compartidos
- `app/api/admin/productos/route.ts` - Usa helpers compartidos
- `app/api/admin/promociones/route.ts` - Usa helpers compartidos
- `app/api/admin/cms/route.ts` - Usa helpers compartidos
- `app/api/admin/descuentos/route.ts` - Usa helpers compartidos
- `app/api/bookings/route.ts` - Usa Postgres con fallback a JSON
- `package.json` - Nuevo comando `npm run migrate`

### **Comportamiento:**
- **Sin variables de entorno**: Usa JSON (desarrollo local)
- **Con variables de entorno**: Usa KV + Postgres (producción)

¡Todo funciona automáticamente! 🚀


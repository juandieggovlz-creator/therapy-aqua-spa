# 🚀 Configuración de Variables de Entorno en Vercel

## ✅ Variables REQUERIDAS para producción

Para que las reservas y el sistema funcionen correctamente en Vercel, debes configurar la siguiente variable de entorno:

### **Variable principal:**

```
POSTGRES_URL=postgresql://neondb_owner:npg_0MdERIvnw1Kg@ep-round-haze-ahv9sgbp-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

---

## 📝 Cómo configurar en Vercel

1. **Ve a tu proyecto en Vercel**: https://vercel.com/dashboard
2. Selecciona tu proyecto **therapy-aqua-spa**
3. Ve a **Settings** → **Environment Variables**
4. Agrega la variable:
   - **Name**: `POSTGRES_URL`
   - **Value**: `postgresql://neondb_owner:npg_0MdERIvnw1Kg@ep-round-haze-ahv9sgbp-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require`
   - **Environment**: Selecciona **Production**, **Preview**, y **Development**
5. Click en **Save**

---

## 🔄 Redeploy

Después de agregar la variable:

1. Ve a **Deployments**
2. Selecciona el último deployment
3. Click en los 3 puntos (**...**) → **Redeploy**
4. Selecciona **Use existing Build Cache** (opcional)
5. Click en **Redeploy**

---

## ✅ Verificación

Después del deploy, verifica que todo funcione:

- ✅ Página de reservas carga correctamente
- ✅ Los servicios se muestran (deben cargar desde BD)
- ✅ Puedes crear una reserva de prueba
- ✅ Panel de administración funciona
- ✅ Tab "Servicios" muestra las terapias desde BD

---

## 🗄️ Base de Datos

### **Estado actual:**
- ✅ Migraciones aplicadas
- ✅ Tablas creadas:
  - `reservas`
  - `servicios` (14 terapias)
  - `servicios_adicionales` (3)
  - `productos` (2)
  - `horarios` (24)
  - `configuracion` (6)

### **Datos poblados:**
- ✅ 14 servicios/terapias
- ✅ 3 servicios adicionales (Sauna, Jacuzzi, Turco)
- ✅ 2 productos (Candado, Ropa)
- ✅ 24 horarios disponibles
- ✅ Configuración inicial (teléfono, descuentos, etc.)

---

## 🔍 Troubleshooting

Si las reservas no funcionan después del deploy:

1. **Verifica la variable de entorno**:
   - En Vercel → Settings → Environment Variables
   - Confirma que `POSTGRES_URL` esté configurada

2. **Revisa los logs**:
   - En Vercel → Deployments → Click en el deployment
   - Ve a "Function Logs" para ver errores

3. **Verifica la conexión a Neon**:
   - Ve a tu dashboard de Neon
   - Confirma que la BD tiene las 6 tablas
   - Verifica que los datos estén poblados

4. **Fuerza un nuevo build**:
   - Haz un cambio mínimo (ej: espacio en README)
   - Commit y push
   - Vercel hará un nuevo build automáticamente

---

## 📞 Soporte

Si tienes problemas, revisa:
- Logs de Vercel
- Dashboard de Neon
- Variables de entorno configuradas

**Base de datos de producción**: `ep-round-haze-ahv9sgbp-pooler`
**Base de datos de desarrollo local**: `ep-hidden-base-ahbw7ayi-pooler`

---

## ✨ Features habilitados con Prisma + Neon

- ✅ Gestión dinámica de servicios desde panel admin
- ✅ Cambios de precios en tiempo real
- ✅ Activar/desactivar servicios sin tocar código
- ✅ Gestión de horarios disponibles
- ✅ Configuración global editable
- ✅ Todas las reservas en una sola base de datos


# 🔧 CONFIGURACIÓN DE VARIABLES DE ENTORNO - AWS RDS

## ⚠️ IMPORTANTE

El archivo `.env.local` ha sido **actualizado** para usar **AWS RDS** en lugar de Neon/Vercel.

---

## 📋 ESTADO ACTUAL

### ❌ Variables ELIMINADAS (ya no se usan):
```bash
# Ya NO usar estas variables:
REDIS_URL          # ❌ Redis Labs ya no se usa
POSTGRES_URL       # ❌ Neon Postgres ya no se usa
POSTGRES_PRISMA_URL # ❌ Neon pooler ya no se usa
POSTGRES_URL_NON_POOLING # ❌ Neon direct ya no se usa
POSTGRES_USER      # ❌ Usuario de Neon ya no se usa
POSTGRES_HOST      # ❌ Host de Neon ya no se usa
POSTGRES_PASSWORD  # ❌ Password de Neon ya no se usa
POSTGRES_DATABASE  # ❌ DB de Neon ya no se usa
```

### ✅ Variable REQUERIDA (nueva):
```bash
# ÚNICA variable necesaria:
DATABASE_URL="postgresql://postgres:9m*blNSwV?z(w<s.9uxg#5fqv__@[TU-ENDPOINT-RDS]:5432/postgres?sslmode=require"
```

---

## 🚨 ACCIÓN REQUERIDA

### Paso 1: Obtener el Endpoint de AWS RDS

1. Ve a **AWS Console**: https://console.aws.amazon.com/rds/
2. Click en **Databases** (menú izquierdo)
3. Selecciona `therapy-aqua-postgres`
4. En la pestaña **Connectivity & security**
5. Copia el **Endpoint**

**Se verá como**:
```
therapy-aqua-postgres.abc123xyz.us-east-1.rds.amazonaws.com
```

### Paso 2: Actualizar `.env.local`

Abre el archivo `.env.local` y reemplaza `[TU-ENDPOINT-RDS]` con el endpoint real:

**ANTES**:
```bash
DATABASE_URL="postgresql://postgres:9m*blNSwV?z(w<s.9uxg#5fqv__@[TU-ENDPOINT-RDS]:5432/postgres?sslmode=require"
```

**DESPUÉS** (ejemplo):
```bash
DATABASE_URL="postgresql://postgres:9m*blNSwV?z(w<s.9uxg#5fqv__@therapy-aqua-postgres.abc123xyz.us-east-1.rds.amazonaws.com:5432/postgres?sslmode=require"
```

---

## 📝 INFORMACIÓN DE CONEXIÓN

### Datos de AWS RDS:
```
Motor:        PostgreSQL
Servicio:     AWS RDS
Usuario:      postgres
Password:     9m*blNSwV?z(w<s.9uxg#5fqv__
Puerto:       5432
Base de datos: postgres
Región:       us-east-1
ARN:          arn:aws:rds:us-east-1:087819428225:db:therapy-aqua-postgres
```

---

## ✅ VERIFICAR CONFIGURACIÓN

### 1. Verificar que `.env.local` está correcto:
```bash
cat .env.local
# o en Windows:
type .env.local
```

Debe tener SOLO `DATABASE_URL`, sin variables de Neon o Redis.

### 2. Probar conexión a BD:
```bash
npx tsx scripts/verificar-servicios-db.ts
```

Si funciona, verás:
```
🔍 Verificando servicios en la base de datos...
📊 Total de servicios en BD: X
✅ Servicios encontrados:
```

Si falla con "Environment variable not found: DATABASE_URL", significa que:
- ❌ No configuraste DATABASE_URL
- ❌ O no reemplazaste `[TU-ENDPOINT-RDS]`

### 3. Migrar servicios a BD (primera vez):
```bash
npx tsx scripts/migrar-servicios-a-bd.ts
```

Esto insertará los 6 servicios base en la BD de AWS RDS.

### 4. Iniciar servidor:
```bash
npm run dev
```

Si todo está bien, verás:
```
✓ Ready in X ms
```

---

## 🔄 CAMBIOS REALIZADOS

### Fecha: 2026-01-31
### Archivo: `.env.local`

**Cambios**:
1. ❌ Eliminadas todas las variables de **Neon** (POSTGRES_*)
2. ❌ Eliminada variable de **Redis** (REDIS_URL)
3. ✅ Agregada variable **DATABASE_URL** para AWS RDS
4. ✅ Actualizado formato y comentarios

**Backup**:
Si necesitas recuperar las credenciales anteriores, están en:
- Documentación anterior: `DESPLIEGUE_VERCEL_NEON.md` (eliminado, pero en Git)
- Commit anterior: `8a37d45` (antes de la migración a AWS)

---

## 🚨 PROBLEMAS COMUNES

### Error: "Environment variable not found: DATABASE_URL"
**Causa**: No has reemplazado `[TU-ENDPOINT-RDS]` con el endpoint real
**Solución**: Sigue el "Paso 2" arriba

### Error: "Can't reach database server"
**Causa**: 
- Endpoint incorrecto
- RDS en VPC privada sin configurar acceso
- Security Group no permite conexión desde tu IP

**Solución**:
1. Verifica el endpoint
2. Verifica que RDS tenga "Public accessibility: Yes"
3. Actualiza Security Group para permitir tu IP en puerto 5432

### Error: "password authentication failed for user 'postgres'"
**Causa**: Password incorrecto
**Solución**: Verifica que el password sea exactamente: `9m*blNSwV?z(w<s.9uxg#5fqv__`

---

## 📚 DOCUMENTACIÓN RELACIONADA

- `AWS_DEPLOYMENT.md` - Guía completa de despliegue en AWS
- `INSTRUCCIONES_DESPLIEGUE.md` - Guía rápida paso a paso
- `AWS_RDS_CONFIG.md` - Configuración de AWS RDS
- `SINCRONIZACION_ADMIN_WEB.md` - Sincronización panel admin

---

## ✅ CHECKLIST

- [x] `.env.local` actualizado con nueva estructura
- [ ] Obtener endpoint de AWS RDS
- [ ] Reemplazar `[TU-ENDPOINT-RDS]` en `.env.local`
- [ ] Verificar conexión: `npx tsx scripts/verificar-servicios-db.ts`
- [ ] Migrar servicios: `npx tsx scripts/migrar-servicios-a-bd.ts`
- [ ] Iniciar servidor: `npm run dev`
- [ ] Verificar que la página principal cargue servicios de BD

---

**Branch**: `aws-backend-stable`  
**Estado**: `.env.local` actualizado, falta configurar endpoint  
**Próximo paso**: Obtener endpoint de AWS RDS Console


# 📋 TAREAS PENDIENTES PARA DESPLIEGUE EN AWS

## ✅ COMPLETADO

- [x] Eliminar todas las dependencias de Vercel/Neon
- [x] Configurar Prisma para usar `DATABASE_URL`
- [x] Eliminar scripts obsoletos (check-db.js, run-migration.js)
- [x] Crear `amplify.yml` para AWS Amplify
- [x] Crear documentación completa
- [x] Verificar build local exitoso (✅ sin errores)
- [x] Commitear y pushear a `aws-backend-stable`

---

## ⏳ PENDIENTE (REQUIERE ACCIÓN MANUAL)

### 1️⃣ OBTENER ENDPOINT DE AWS RDS ⚠️

**Dónde:**
1. Ve a **AWS Console** → https://console.aws.amazon.com/rds/
2. Click en **Databases** (menú izquierdo)
3. Selecciona `therapy-aqua-postgres`
4. En la pestaña **Connectivity & security**
5. Copia el **Endpoint** (se ve como: `therapy-aqua-postgres.XXXXXX.us-east-1.rds.amazonaws.com`)

**Por qué es necesario:**
Sin el endpoint, no puedes conectarte a la base de datos ni desde local ni desde Amplify.

---

### 2️⃣ CONFIGURAR `.env.local` LOCALMENTE

**Crear archivo** `.env.local` en la raíz del proyecto:

```bash
DATABASE_URL="postgresql://postgres:9m*blNSwV?z(w<s.9uxg#5fqv__@[PEGA-AQUI-EL-ENDPOINT]:5432/postgres?sslmode=require"
```

**Ejemplo completo:**
```bash
DATABASE_URL="postgresql://postgres:9m*blNSwV?z(w<s.9uxg#5fqv__@therapy-aqua-postgres.abc123xyz.us-east-1.rds.amazonaws.com:5432/postgres?sslmode=require"
```

---

### 3️⃣ EJECUTAR MIGRACIONES EN AWS RDS

**Comandos:**
```bash
# 1. Verificar conexión
npx prisma db pull

# 2. Ejecutar migraciones
npx prisma migrate deploy

# 3. (Opcional) Abrir Prisma Studio para verificar
npx prisma studio
```

**Esto creará las tablas:**
- `reservas`
- `servicios`
- `servicios_adicionales`
- `productos`
- `horarios`
- `configuracion`

---

### 4️⃣ CREAR APP EN AWS AMPLIFY

**Pasos:**
1. Ve a **AWS Console** → https://console.aws.amazon.com/amplify/
2. Click en **New app** → **Host web app**
3. Selecciona **GitHub** como source
4. Conecta tu cuenta de GitHub
5. Selecciona el repositorio: `therapy-aqua-spa`
6. **IMPORTANTE**: Selecciona el branch `aws-backend-stable`
7. Click **Next**

---

### 5️⃣ CONFIGURAR VARIABLE DE ENTORNO EN AMPLIFY

**Dónde:**
En la configuración de Amplify, antes de hacer el primer deploy:

1. Ve a **App settings** → **Environment variables**
2. Click **Add variable**
3. Agrega:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://postgres:9m*blNSwV?z(w<s.9uxg#5fqv__@[TU-ENDPOINT]:5432/postgres?sslmode=require`

⚠️ **Reemplaza `[TU-ENDPOINT]` con el endpoint real del paso 1**

---

### 6️⃣ CONFIGURAR VPC (SI RDS ES PRIVADO)

**¿Cómo saber si necesitas esto?**
- Si tu RDS está en una VPC privada (sin acceso público)
- Si al intentar conectarte desde Amplify obtienes error "Can't reach database server"

**Pasos:**
1. En Amplify Console → **App settings** → **VPC**
2. Click **Configure VPC**
3. Selecciona:
   - **VPC**: La VPC donde está tu RDS
   - **Subnets**: Al menos 2 subnets privadas (diferentes AZs)
   - **Security Group**: Crea uno nuevo o usa uno existente

4. Actualiza el **Security Group del RDS**:
   - Ve a RDS → `therapy-aqua-postgres` → **Connectivity & security** → **VPC security groups**
   - Edita el security group
   - Agrega **Inbound rule**:
     - **Type**: PostgreSQL (5432)
     - **Source**: Security Group de Amplify (del paso 3)

---

### 7️⃣ DEPLOY EN AMPLIFY

1. Verifica que `amplify.yml` esté configurado (✅ ya está)
2. Verifica que la variable `DATABASE_URL` esté configurada
3. Click **Save and deploy**
4. Espera 5-10 minutos
5. Revisa los **Build logs** para verificar:
   - ✅ `npm ci` exitoso
   - ✅ `npx prisma generate` exitoso
   - ✅ `npm run build` exitoso

---

### 8️⃣ VERIFICAR DESPLIEGUE

**Una vez terminado el deploy:**

1. **Página principal**: Abre la URL de Amplify
2. **Servicios**: Ve a `/servicios` y verifica que carguen
3. **Reservas**: Ve a `/reservas` y prueba crear una reserva
4. **Panel Admin**: 
   - Ve a `/login/afiliados/admin`
   - Login: `admin@therapyaquaspa.com` / `TaSpa2026!Admin#Secure`
   - Verifica que cargue el dashboard

---

## 🚨 POSIBLES PROBLEMAS Y SOLUCIONES

### Error: "Can't reach database server"

**Causas posibles:**
1. Endpoint incorrecto en `DATABASE_URL`
2. RDS en VPC privada sin configurar VPC en Amplify
3. Security Group del RDS no permite conexiones desde Amplify

**Solución:**
- Verifica el endpoint
- Configura VPC en Amplify (paso 6)
- Actualiza Security Group del RDS

---

### Error: "Prisma Client not generated"

**Causas posibles:**
1. `amplify.yml` no tiene `npx prisma generate`
2. `package.json` no tiene `postinstall: prisma generate`

**Solución:**
- ✅ Ya está configurado en el proyecto
- Revisa los build logs en Amplify

---

### Error: "Table 'reservas' doesn't exist"

**Causa:**
No se ejecutaron las migraciones en AWS RDS

**Solución:**
Ejecuta el paso 3 (migraciones)

---

### Error: Conflicto de reservas (misma hora/día)

**Causa:**
Sistema de prevención de conflictos no está funcionando

**Solución:**
- ✅ Ya está implementado en `lib/reservas-helpers.ts`
- Verifica que las migraciones crearon los índices correctamente

---

## 📊 ORDEN RECOMENDADO

```
1. Obtener endpoint de RDS (AWS Console)
   ↓
2. Configurar .env.local localmente
   ↓
3. Ejecutar migraciones (npx prisma migrate deploy)
   ↓
4. Verificar tablas creadas (npx prisma studio)
   ↓
5. Crear app en Amplify
   ↓
6. Configurar DATABASE_URL en Amplify
   ↓
7. Configurar VPC (si es necesario)
   ↓
8. Deploy y verificar logs
   ↓
9. Probar funcionalidades
   ↓
10. ✅ LISTO
```

---

## 📞 INFORMACIÓN IMPORTANTE

### Credenciales RDS:
- **Usuario**: `postgres`
- **Password**: `9m*blNSwV?z(w<s.9uxg#5fqv__`
- **Puerto**: `5432`
- **Base de datos**: `postgres`
- **Región**: `us-east-1`

### Credenciales Admin Panel:
- **Admin**: `admin@therapyaquaspa.com` / `TaSpa2026!Admin#Secure`
- **Fisio**: `fisio@therapyaquaspa.com` / `Fisio2026!Therapy#Pro`

### Branch de trabajo:
- **Branch**: `aws-backend-stable`
- **Commits**: 3 (migración + amplify + docs)

---

## 📚 DOCUMENTACIÓN DISPONIBLE

- `INSTRUCCIONES_DESPLIEGUE.md` - Guía rápida paso a paso
- `AWS_DEPLOYMENT.md` - Documentación completa (281 líneas)
- `AWS_RDS_CONFIG.md` - Configuración de RDS
- `RESUMEN_MIGRACION_AWS.md` - Resumen de cambios realizados
- `amplify.yml` - Configuración de build para Amplify

---

**🎯 PRÓXIMO PASO INMEDIATO:**

👉 **Obtener el endpoint de AWS RDS** (paso 1)

Sin el endpoint, no puedes continuar con los demás pasos.

---

**Última actualización**: 2026-01-31  
**Estado del proyecto**: ✅ LISTO PARA DESPLEGAR  
**Build local**: ✅ EXITOSO (sin errores)



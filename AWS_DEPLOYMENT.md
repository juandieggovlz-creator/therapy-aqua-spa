# 🚀 Despliegue en AWS (RDS + Amplify)

## ✅ Limpieza Completada

El proyecto ha sido **completamente limpiado** de dependencias de Vercel y Neon:

### Eliminado:
- ❌ `@vercel/postgres`
- ❌ `@vercel/kv`
- ❌ `redis`
- ❌ Scripts de migración de Vercel/Neon
- ❌ Documentación de Vercel/Neon
- ❌ Referencias a `POSTGRES_URL`, `NEON_*`, `REDIS_URL`

### Mantenido:
- ✅ **Next.js 16.1.1** (compatible con AWS Amplify)
- ✅ **Prisma 5.22.0** (ORM para PostgreSQL)
- ✅ **@prisma/client** (generación automática)
- ✅ Sistema de reservas completo
- ✅ Panel de administración
- ✅ API Routes
- ✅ Estructura de notificaciones (Telegram - preparada para futuro)

---

## 📋 Configuración de AWS RDS

### Información de tu Base de Datos:
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

### ⚠️ IMPORTANTE: Obtener el Endpoint

**Necesitas completar el endpoint de tu RDS:**

1. Ve a **AWS Console** → **RDS** → **Databases**
2. Selecciona `therapy-aqua-postgres`
3. En **Connectivity & security**, copia el **Endpoint**
4. Se verá como: `therapy-aqua-postgres.XXXXXX.us-east-1.rds.amazonaws.com`

---

## 🔧 Configuración de Variables de Entorno

### Para desarrollo local (.env.local):

```bash
DATABASE_URL="postgresql://postgres:9m*blNSwV?z(w<s.9uxg#5fqv__@[TU-ENDPOINT-AQUI]:5432/postgres?sslmode=require"
```

### Ejemplo completo:
```bash
DATABASE_URL="postgresql://postgres:9m*blNSwV?z(w<s.9uxg#5fqv__@therapy-aqua-postgres.abc123xyz.us-east-1.rds.amazonaws.com:5432/postgres?sslmode=require"
```

---

## 🏗️ Configuración en AWS Amplify

### 1. Crear nueva aplicación en Amplify

1. Ve a **AWS Console** → **AWS Amplify**
2. Click en **New app** → **Host web app**
3. Conecta tu repositorio de GitHub
4. Selecciona el branch: `prueba-nueva`

### 2. Configurar Build Settings

Amplify debería detectar automáticamente Next.js. Verifica que el `amplify.yml` sea:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
        - npx prisma generate
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### 3. Agregar Variables de Entorno

En **Amplify Console** → **App settings** → **Environment variables**:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://postgres:9m*blNSwV?z(w<s.9uxg#5fqv__@[TU-ENDPOINT]:5432/postgres?sslmode=require` |

⚠️ **Reemplaza `[TU-ENDPOINT]` con el endpoint real de tu RDS**

### 4. Configurar VPC (si es necesario)

Si tu RDS está en una VPC privada:
1. Ve a **App settings** → **VPC**
2. Configura la VPC, subnets y security groups
3. Asegúrate de que el security group del RDS permita conexiones desde Amplify

---

## 🗄️ Migración de Base de Datos

### Ejecutar migraciones en AWS RDS:

```bash
# 1. Configurar DATABASE_URL en .env.local con el endpoint de AWS RDS

# 2. Ejecutar migraciones
npx prisma migrate deploy

# 3. (Opcional) Verificar conexión
npx prisma studio
```

### Tablas requeridas:

El schema de Prisma (`prisma/schema.prisma`) incluye:
- ✅ `reservas` - Sistema de reservas
- ✅ `servicios` - Catálogo de servicios
- ✅ `servicios_adicionales` - Servicios complementarios
- ✅ `productos` - Productos del spa
- ✅ `horarios` - Horarios disponibles
- ✅ `configuracion` - Configuración del sitio

---

## ✅ Verificación Local

Antes de desplegar, verifica que todo funcione localmente:

```bash
# 1. Instalar dependencias
npm install

# 2. Generar Prisma Client
npx prisma generate

# 3. Ejecutar migraciones (con DATABASE_URL configurado)
npx prisma migrate deploy

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Build de producción
npm run build
```

---

## 🚨 Prevención de Conflictos de Reservas

El sistema incluye **validación automática** para evitar reservas duplicadas:

### Función: `verificarConflictoHorario`

```typescript
// lib/reservas-helpers.ts
export async function verificarConflictoHorario(
  fecha: string,
  horario: string,
  excludeId?: string
): Promise<{ hayConflicto: boolean; reservaConflictiva?: any }>
```

**Características:**
- ✅ Verifica fecha + horario antes de crear reserva
- ✅ Libera automáticamente reservas expiradas (>30 min en estado pendiente)
- ✅ Considera estados: `pendiente`, `pendiente de pago`, `confirmada`
- ✅ Excluye la reserva actual al editar

**Uso en API:**
```typescript
// Antes de crear/actualizar reserva
const { hayConflicto, reservaConflictiva } = await verificarConflictoHorario(
  fecha,
  horario,
  reservationIdActual // opcional al editar
);

if (hayConflicto) {
  return NextResponse.json(
    { error: "Ya existe una reserva para este horario" },
    { status: 409 }
  );
}
```

---

## 📊 Monitoreo Post-Despliegue

### En AWS Amplify:
1. **Build logs**: Verifica que `prisma generate` se ejecute correctamente
2. **Runtime logs**: Revisa errores de conexión a RDS
3. **Metrics**: Monitorea latencia y errores

### En AWS RDS:
1. **Performance Insights**: Analiza queries lentas
2. **CloudWatch**: Monitorea conexiones y CPU
3. **Query logs**: Habilita para debugging (temporal)

---

## 🔐 Seguridad

### Recomendaciones:
1. ✅ **SSL/TLS habilitado** (`sslmode=require` en DATABASE_URL)
2. ⚠️ **Rotar password** del RDS periódicamente
3. ⚠️ **Security Groups**: Solo permitir tráfico desde Amplify
4. ⚠️ **Secrets Manager**: Considera migrar password a AWS Secrets Manager
5. ✅ **Variables de entorno**: Nunca commitear `.env.local`

---

## 📝 Checklist de Despliegue

- [ ] Obtener endpoint de RDS
- [ ] Configurar `DATABASE_URL` en `.env.local` (local)
- [ ] Ejecutar `npx prisma migrate deploy`
- [ ] Verificar build local: `npm run build`
- [ ] Crear app en AWS Amplify
- [ ] Configurar variable `DATABASE_URL` en Amplify
- [ ] Configurar VPC (si RDS es privado)
- [ ] Deploy inicial y verificar logs
- [ ] Probar sistema de reservas
- [ ] Verificar prevención de conflictos
- [ ] Probar panel de administración

---

## 🆘 Troubleshooting

### Error: "Can't reach database server"
- Verifica que el endpoint de RDS sea correcto
- Revisa security groups (debe permitir conexiones desde Amplify)
- Confirma que `sslmode=require` esté en DATABASE_URL

### Error: "Prisma Client not generated"
- Verifica que `postinstall: prisma generate` esté en `package.json`
- Revisa build logs en Amplify
- Asegúrate de que `prisma/schema.prisma` exista

### Error: "Duplicate reservation"
- El sistema debería prevenirlo automáticamente
- Verifica que `verificarConflictoHorario` se llame antes de crear reservas
- Revisa índices en la tabla `reservas` (fecha, horario)

---

## 📞 Soporte

Para problemas específicos de AWS:
- **RDS**: [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- **Amplify**: [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- **Prisma**: [Prisma Documentation](https://www.prisma.io/docs)

---

**Última actualización**: 2026-01-31  
**Branch**: `prueba-nueva`  
**Commit**: Limpieza completa para AWS RDS + Amplify



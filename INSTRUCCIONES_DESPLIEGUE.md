# 🚀 INSTRUCCIONES RÁPIDAS - DESPLIEGUE AWS

## ⚡ PASO 1: Obtener Endpoint de RDS

1. Ve a **AWS Console** → **RDS** → **Databases**
2. Selecciona `therapy-aqua-postgres`
3. En **Connectivity & security**, copia el **Endpoint**
4. Se verá como: `therapy-aqua-postgres.XXXXXX.us-east-1.rds.amazonaws.com`

---

## ⚡ PASO 2: Configurar Variable de Entorno

### En tu archivo `.env.local` (desarrollo local):

```bash
DATABASE_URL="postgresql://postgres:9m*blNSwV?z(w<s.9uxg#5fqv__@[PEGA-AQUI-TU-ENDPOINT]:5432/postgres?sslmode=require"
```

### Ejemplo completo:
```bash
DATABASE_URL="postgresql://postgres:9m*blNSwV?z(w<s.9uxg#5fqv__@therapy-aqua-postgres.abc123xyz.us-east-1.rds.amazonaws.com:5432/postgres?sslmode=require"
```

---

## ⚡ PASO 3: Migrar la Base de Datos

```bash
# Ejecuta las migraciones en AWS RDS
npx prisma migrate deploy

# Verifica que las tablas se crearon
npx prisma studio
```

---

## ⚡ PASO 4: Configurar AWS Amplify

### 4.1 Crear la App

1. Ve a **AWS Console** → **AWS Amplify**
2. Click **New app** → **Host web app**
3. Conecta GitHub
4. Selecciona el repositorio: `therapy-aqua-spa`
5. **Branch**: `aws-backend-stable` ← ¡IMPORTANTE!

### 4.2 Agregar Variable de Entorno

En **Amplify Console** → **App settings** → **Environment variables**:

```
Key: DATABASE_URL
Value: postgresql://postgres:9m*blNSwV?z(w<s.9uxg#5fqv__@[TU-ENDPOINT]:5432/postgres?sslmode=require
```

⚠️ **Reemplaza `[TU-ENDPOINT]` con el endpoint real que copiaste en el Paso 1**

### 4.3 Configurar Build Settings (Opcional)

Si Amplify no detecta automáticamente el `amplify.yml`, configura manualmente:

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

### 4.4 Deploy

Click **Save and deploy** y espera a que termine el build (aprox. 5-10 minutos).

---

## ⚡ PASO 5: Verificar el Despliegue

1. Una vez terminado el build, abre la URL de Amplify
2. Verifica que la página principal cargue
3. Prueba crear una reserva en `/reservas`
4. Accede al panel admin en `/login/afiliados/admin`
   - Usuario: `admin@therapyaquaspa.com`
   - Password: `TaSpa2026!Admin#Secure`

---

## 🔒 SEGURIDAD DEL RDS

### Si tu RDS está en VPC privada:

1. Ve a **Amplify Console** → **App settings** → **VPC**
2. Configura:
   - **VPC**: La VPC donde está tu RDS
   - **Subnets**: Al menos 2 subnets privadas
   - **Security Group**: Debe permitir tráfico desde Amplify

3. Actualiza el Security Group del RDS:
   - **Tipo**: PostgreSQL (5432)
   - **Origen**: Security Group de Amplify

---

## ✅ CHECKLIST RÁPIDO

- [ ] Obtener endpoint de RDS
- [ ] Configurar `.env.local` localmente
- [ ] Ejecutar `npx prisma migrate deploy`
- [ ] Crear app en Amplify
- [ ] Seleccionar branch `aws-backend-stable`
- [ ] Configurar `DATABASE_URL` en Amplify
- [ ] Configurar VPC (si aplica)
- [ ] Deploy y verificar logs
- [ ] Probar reservas
- [ ] Probar panel admin

---

## 🆘 PROBLEMAS COMUNES

### Error: "Can't reach database server"
✅ Verifica que el endpoint sea correcto
✅ Revisa security groups (debe permitir desde Amplify)
✅ Confirma que `sslmode=require` esté en la URL

### Error: "Prisma Client not generated"
✅ Verifica que `amplify.yml` tenga `npx prisma generate`
✅ Revisa build logs en Amplify
✅ Confirma que `package.json` tenga `postinstall: prisma generate`

### Error: Conflicto de reservas
✅ El sistema lo previene automáticamente
✅ Verifica que las migraciones se hayan ejecutado correctamente

---

## 📞 CREDENCIALES IMPORTANTES

### Base de Datos AWS RDS:
- **Usuario**: `postgres`
- **Password**: `9m*blNSwV?z(w<s.9uxg#5fqv__`
- **Puerto**: `5432`
- **Base de datos**: `postgres`
- **Región**: `us-east-1`

### Panel Admin:
- **Admin**: `admin@therapyaquaspa.com` / `TaSpa2026!Admin#Secure`
- **Fisio**: `fisio@therapyaquaspa.com` / `Fisio2026!Therapy#Pro`

---

**Branch de trabajo**: `aws-backend-stable`  
**Última actualización**: 2026-01-31


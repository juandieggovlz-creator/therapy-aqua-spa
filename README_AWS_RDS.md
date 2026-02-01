# 🚀 Therapy Aqua Spa - Configuración AWS RDS

## ✅ Proyecto limpio y configurado con AWS RDS + Prisma

El proyecto ha sido completamente limpiado y ahora usa **ÚNICAMENTE AWS RDS con Prisma ORM**.

---

## 📋 Cambios Realizados

### 🗑️ Eliminado
- ❌ `@vercel/postgres` - Eliminado de dependencias
- ❌ `@vercel/kv` - Eliminado de dependencias
- ❌ `redis` - Eliminado de dependencias
- ❌ Scripts con referencias a Neon/Vercel
- ❌ Documentación de Vercel/Neon

### ✅ Actualizado
- ✅ `package.json` - Solo dependencias necesarias
- ✅ `prisma/schema.prisma` - Usa `DATABASE_URL`
- ✅ `.env.local` - Credenciales AWS RDS actualizadas
- ✅ Prisma Client regenerado

---

## 🔐 Credenciales AWS RDS

### Detalles de Conexión
```
Host:     therapy-aqua-postgres.c6766skswdu6.us-east-1.rds.amazonaws.com
Port:     5432
Database: postgres
User:     postgres
Password: TherapyDB#26$
SSL:      required
```

### ARN de Recursos
```
RDS ARN: arn:aws:rds:us-east-1:087819428225:db:therapy-aqua-postgres
KMS ARN: arn:aws:kms:us-east-1:087819428225:key/ac995c5b-24d0-46f4-a6c7-c6033b549df9
```

---

## 🛠️ Configuración de Variables de Entorno

### Archivo `.env.local` (Ya configurado)

El archivo `.env.local` debe contener:

```bash
# AWS RDS PostgreSQL Database
DATABASE_URL="postgresql://postgres:TherapyDB%2326%24@therapy-aqua-postgres.c6766skswdu6.us-east-1.rds.amazonaws.com:5432/postgres?schema=public&sslmode=require"
POSTGRES_URL="postgresql://postgres:TherapyDB%2326%24@therapy-aqua-postgres.c6766skswdu6.us-east-1.rds.amazonaws.com:5432/postgres?schema=public&sslmode=require"

# Telegram Bot (opcional)
TELEGRAM_BOT_TOKEN=7769976859:AAGUWdq0BZE7hWZNjTWDRXf5AWA_Wcp3jYI
TELEGRAM_CHAT_ID=-4583773668
```

⚠️ **IMPORTANTE**: Los caracteres especiales en la contraseña están codificados:
- `#` → `%23`
- `$` → `%24`

### Copiar credenciales

Si necesitas actualizar `.env.local`, copia el contenido desde el archivo:
```
AWS_RDS_CREDENTIALS.txt
```

---

## 📦 Estructura del Proyecto

```
therapy-aqua-spa/
├── app/                          # Código de la aplicación Next.js
│   ├── api/                      # API Routes
│   ├── components/               # Componentes React
│   └── ...
├── prisma/
│   └── schema.prisma             # Schema de Prisma (usa DATABASE_URL)
├── .env.local                    # Variables de entorno (NO se sube a Git)
├── AWS_RDS_CREDENTIALS.txt       # Plantilla de credenciales
└── package.json                  # Dependencias limpias
```

---

## 🚀 Comandos Importantes

### Desarrollo Local
```bash
npm run dev
# Servidor en http://localhost:3000
```

### Gestión de Base de Datos
```bash
# Generar Prisma Client
npx prisma generate

# Ver datos en Prisma Studio
npx prisma studio

# Aplicar cambios al schema
npx prisma db push

# Ver migraciones
npx prisma migrate dev
```

### Producción
```bash
npm run build
npm start
```

---

## 🔍 Verificar Conexión a AWS RDS

Para verificar que la conexión a AWS RDS funciona correctamente, puedes crear un script de prueba:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('✅ Conexión exitosa:', result);
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
  }
}

test();
```

---

## ⚡ Estado Actual

### ✅ Funcionando
- ✅ Conexión a AWS RDS PostgreSQL
- ✅ Prisma ORM configurado y funcionando
- ✅ 15 servicios activos en la base de datos
- ✅ Servidor Next.js en puerto 3000
- ✅ Sin dependencias de Vercel/Neon

### 📊 Base de Datos
- **Total de servicios**: 15
- **Servicios activos**: 15
- **Tablas**: `servicios`, `reservas`, `productos`, `horarios`, `configuracion`

---

## 🔒 Seguridad

### Variables de Entorno
- ✅ `.env.local` está en `.gitignore`
- ✅ Las credenciales NO se suben a Git
- ✅ Conexión SSL habilitada (`sslmode=require`)

### AWS Security Group
Asegúrate de que el Security Group de RDS permita:
- **Puerto**: 5432
- **Protocolo**: TCP
- **Origen**: Tu IP o 0.0.0.0/0 (para desarrollo)

---

## 📝 Notas Importantes

1. **Puerto del servidor**: SIEMPRE debe ser **3000**
   - No usar puerto 3001 ni otros puertos
   - Si hay problemas, ejecutar:
     ```bash
     taskkill /F /IM node.exe
     Remove-Item -Path ".next" -Recurse -Force
     npm run dev
     ```

2. **Base de datos**: Solo AWS RDS
   - No usar Neon, Vercel Postgres, ni otros servicios
   - Todas las consultas pasan por Prisma

3. **Componentes visuales**: NO modificados
   - Los estilos y diseño permanecen intactos
   - Solo se limpiaron las dependencias del backend

---

## 🆘 Solución de Problemas

### Error: "Unable to acquire lock"
```bash
taskkill /F /IM node.exe
Remove-Item -Path ".next" -Recurse -Force
npm run dev
```

### Error: "Port 3000 is in use"
```bash
taskkill /F /IM node.exe
npm run dev
```

### Error: "Environment variable not found: DATABASE_URL"
1. Verificar que `.env.local` exista
2. Copiar contenido de `AWS_RDS_CREDENTIALS.txt`
3. Ejecutar `npx prisma generate`

### Error de conexión a RDS
1. Verificar que la instancia RDS esté activa en AWS
2. Verificar el Security Group (puerto 5432 abierto)
3. Verificar las credenciales en `.env.local`
4. Verificar que la contraseña sea: `TherapyDB#26$`

---

## 📞 Soporte

Para problemas con:
- **AWS RDS**: Consola de AWS → RDS → therapy-aqua-postgres
- **Prisma**: https://www.prisma.io/docs
- **Next.js**: https://nextjs.org/docs

---

**✅ Proyecto listo para desarrollo y producción con AWS RDS**


# 📌 DOCUMENTACIÓN TÉCNICA OFICIAL - THERAPY AQUA SPA

Esta es la guía técnica de implementación real para **Therapy Aqua Spa**. Este documento describe el sistema tal como está construido actualmente, sin herramientas externas o dependencias no implementadas.

---

## 1. VISIÓN GENERAL
**Therapy Aqua Spa** es una plataforma de gestión de servicios de bienestar y salud que permite a los usuarios reservar servicios (masajes, terapias de columna, etc.) y productos relacionados.

### Módulos Principales
*   **Home/Landing:** Presentación de servicios, testimonios y contacto.
*   **Reservas:** Sistema interactivo para elegir servicio, fecha, horario y realizar la reserva.
*   **Servicios:** Catálogo detallado de tratamientos ofrecidos.
*   **Admin Panel:** Panel administrativo unificado para gestionar servicios, reservas, productos, FAQs y contenido web.

### Flujo General
1. El usuario selecciona un servicio y horario en la web.
2. La reserva se guarda en la base de datos RDS con estado `pendiente` o `pendiente de pago`.
3. El sistema notifica vía Telegram (si está configurado) y gestiona los conflictos de horario.
4. El administrador gestiona la reserva desde su panel interno.

---

## 2. STACK REAL UTILIZADO
Tecnologías detectadas y operativas en el repositorio:

*   **Frontend:** Next.js 16 (App Router) / React 19.
*   **Backend:** API Routes de Next.js (Node.js runtime).
*   **Base de Datos:** AWS RDS Aurora (PostgreSQL).
*   **ORM:** Prisma ORM.
*   **Hosting:** AWS Amplify.
*   **Estilos:** TailwindCSS 4.
*   **Autenticación:** Login administrativo basado en Cookies seguras (`httpOnly`) y BCryptjs para hashing de contraseñas.
*   **Integraciones:** Telegram Bot API para notificaciones de reservas.

---

## 3. INFRAESTRUCTURA AWS

### AWS Amplify
*   **Despliegue:** Conectado directamente al repositorio de GitHub (rama `main`).
*   **Flujo:** Cada "push" en `main` dispara un build automático definido en `amplify.yml`.
*   **Build Commands:**
    ```bash
    npm ci
    npx prisma generate
    npm run build
    ```

### AWS RDS Aurora (PostgreSQL)
*   **Motor:** PostgreSQL 16+.
*   **Conexión:** Gestionada a través de `DATABASE_URL`.
*   **Detalles de Conexión (AWS RDS):**
    *   **Host:** `therapy-aqua-postgres.c6766skswdu6.us-east-1.rds.amazonaws.com`
    *   **Puerto:** `5432`
    *   **Database:** `postgres`
    *   **SSL:** Requerido (`sslmode=require`).
*   **Tablas Principales:**
    *   `reservas`: Gestión de citas y estados.
    *   `servicios`: Catálogo de terapias.
    *   `servicios_adicionales`: Servicios complementarios (Sauna, Jacuzzi, etc.).
    *   `productos`: Venta de productos adicionales.
    *   `admin_users`: Usuarios administrativos.
    *   `web_content`: Contenidos dinámicos del sitio.
    *   `faqs`: Preguntas frecuentes editables.

---

## 4. VARIABLES DE ENTORNO NECESARIAS
Las variables están configuradas en la consola de AWS Amplify y localmente en `.env`.

| Variable | Propósito |
| :--- | :--- |
| `DATABASE_URL` | Cadena de conexión: `postgresql://usuario:pass@host:5432/postgres?sslmode=require` |
| `TELEGRAM_BOT_TOKEN` | Token del bot para enviar alertas de nuevas reservas. |
| `TELEGRAM_CHAT_ID` | ID del grupo/chat destino de notificaciones. |

---

## 5. BASE DE DATOS + PRISMA
*   **Schema:** Ubicado en `prisma/schema.prisma`.
*   **Generación:** `npx prisma generate` (se ejecuta automáticamente en el despliegue).

### Comandos de Mantenimiento:
```bash
# Ver datos y editar manualmente
npx prisma studio

# Sincronizar cambios menores del schema
npx prisma db push

# Crear migración formal
npx prisma migrate dev --name descripcion
```

---

## 6. PANEL DE ADMINISTRACIÓN
*   **Acceso:** `/login/admin`.
*   **Seguridad:** Protegido por `middleware.ts` y cookies `httpOnly`.
*   **Módulos:**
    *   **Reservas:** Visualización, cambio de estados (Pendiente, Confirmada, Cancelada) y desglose de precios.
    *   **Servicios:** Gestión completa de terapias (nombre, precio, duración, imagen).
    *   **Productos:** Catálogo de productos disponibles.
    *   **Contenido Web:** Edición de textos, FAQs y datos de contacto (CMS).

---

## 7. LÓGICA DE RESERVAS Y ESTADOS
*   **Estados Operativos:**
    *   `pendiente`: Reserva registrada esperando gestión.
    *   `pendiente de pago`: Slot bloqueado esperando comprobante.
    *   `confirmada`: Cita agendada oficialmente.
    *   `completada`: Servicio finalizado.
    *   `cancelada`: Cupo liberado.
*   **Reglas de Negocio:**
    *   Las reservas `pendiente` expiran en 2 horas.
    *   Las `pendiente de pago` expiran en 30 minutos.
    *   No se auto-cancelan citas en las 2 horas previas a la hora de inicio.

---

## 8. GESTIÓN DE IMÁGENES
*   **Backend:** `/api/admin/upload-image` procesa la subida.
*   **Almacenamiento:** Las imágenes se guardan en `public/image/` con un prefijo de timestamp.
*   **Pasos para actualizar:**
    1. Desde el panel admin, elegir "Subir Imagen" o escribir la ruta.
    2. El sistema guarda la URL como `/image/nombre-archivo.jpg`.
    3. Para subidas manuales: colocar el archivo en `public/image/` y actualizar el campo en la tabla `servicios`.

---

## 9. FLUJO DE DEPLOY EN AMPLIFY
1. El código se sube a la rama `rds-prisma`.
2. AWS Amplify detecta el push.
3. Ejecuta el ciclo de vida definido en `amplify.yml`:
    - Instalación de dependencias.
    - `prisma generate` para el cliente de base de datos.
    - `next build`.
4. El sitio se despliega automáticamente en la URL de producción.

---

## 10. CHECKLIST PARA FUTURO PROGRAMADOR
✅ **Qué NO tocar:**
*   **Ruta de Imágenes:** No cambies la carpeta `public/image/` sin actualizar el endpoint de subida.
*   **Middleware:** No deshabilites la protección de `/admin/*`.
*   **Prisma Singleton:** Mantén `lib/prisma.ts` para evitar agotar conexiones a RDS.

✅ **Cómo Probar:**
*   Localmente: `npm run dev` (Puerto 3000 forzado).
*   Base de datos: Usa `npx prisma studio` para verificar inserciones.

---
**Documento generado automáticamente para mantenimiento técnico oficial.**

-- CreateTable
CREATE TABLE "servicios" (
    "id" SERIAL NOT NULL,
    "servicio_id" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "categoria" VARCHAR(100) NOT NULL,
    "duracion" INTEGER NOT NULL DEFAULT 30,
    "precio" DECIMAL(10,2) NOT NULL,
    "icon" VARCHAR(10),
    "imagen" VARCHAR(500),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "detalles" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicios_adicionales" (
    "id" SERIAL NOT NULL,
    "servicio_id" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "precio_particular" DECIMAL(10,2) NOT NULL,
    "precio_afiliado" DECIMAL(10,2) NOT NULL,
    "icon" VARCHAR(10),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servicios_adicionales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "producto_id" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "icon" VARCHAR(10),
    "stock" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horarios" (
    "id" SERIAL NOT NULL,
    "hora" VARCHAR(5) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "horarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion" (
    "id" SERIAL NOT NULL,
    "clave" VARCHAR(100) NOT NULL,
    "valor" TEXT NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "categoria" VARCHAR(100) NOT NULL,
    "editable_por_gerente" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "configuracion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "servicios_servicio_id_key" ON "servicios"("servicio_id");

-- CreateIndex
CREATE INDEX "idx_servicio_activo" ON "servicios"("activo");

-- CreateIndex
CREATE INDEX "idx_servicio_categoria" ON "servicios"("categoria");

-- CreateIndex
CREATE UNIQUE INDEX "servicios_adicionales_servicio_id_key" ON "servicios_adicionales"("servicio_id");

-- CreateIndex
CREATE INDEX "idx_servicio_adicional_activo" ON "servicios_adicionales"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "productos_producto_id_key" ON "productos"("producto_id");

-- CreateIndex
CREATE INDEX "idx_producto_activo" ON "productos"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "horarios_hora_key" ON "horarios"("hora");

-- CreateIndex
CREATE INDEX "idx_horario_activo" ON "horarios"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "configuracion_clave_key" ON "configuracion"("clave");

-- CreateIndex
CREATE INDEX "idx_configuracion_categoria" ON "configuracion"("categoria");

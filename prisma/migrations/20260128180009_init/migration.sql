-- CreateTable
CREATE TABLE "reservas" (
    "id" SERIAL NOT NULL,
    "reservation_id" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "fecha" DATE NOT NULL,
    "horario" VARCHAR(10) NOT NULL,
    "servicios" JSONB NOT NULL,
    "productos" JSONB DEFAULT '[]',
    "total" DECIMAL(10,2) NOT NULL,
    "estado" VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    "notas" TEXT,
    "fisioterapeuta" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigo_afiliado" VARCHAR(50),
    "descuento_afiliado" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "descuento_individual" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "descuento_promocion" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reservas_reservation_id_key" ON "reservas"("reservation_id");

-- CreateIndex
CREATE INDEX "idx_fecha_horario" ON "reservas"("fecha", "horario");

-- CreateIndex
CREATE INDEX "idx_estado" ON "reservas"("estado");

-- CreateIndex
CREATE INDEX "idx_reservation_id" ON "reservas"("reservation_id");

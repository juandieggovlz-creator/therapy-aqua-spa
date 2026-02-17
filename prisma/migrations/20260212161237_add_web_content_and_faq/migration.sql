-- CreateTable
CREATE TABLE "web_content" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255),
    "content" TEXT,
    "image" VARCHAR(500),
    "section" VARCHAR(50) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "web_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" SERIAL NOT NULL,
    "question" VARCHAR(500) NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "web_content_key_key" ON "web_content"("key");

-- CreateIndex
CREATE INDEX "idx_web_content_section" ON "web_content"("section");

-- CreateIndex
CREATE INDEX "idx_faq_active" ON "faqs"("active");

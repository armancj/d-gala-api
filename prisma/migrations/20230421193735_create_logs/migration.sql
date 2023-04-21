-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "method" TEXT,
    "originalUrl" TEXT,
    "params" INTEGER,
    "statusCode" INTEGER,
    "statusMessage" TEXT,
    "user" JSONB,
    "contentLength" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

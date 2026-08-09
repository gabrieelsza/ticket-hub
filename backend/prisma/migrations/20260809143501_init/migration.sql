-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ORGANIZADOR', 'CLIENTE', 'PORTARIA');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('FILME', 'SHOW');

-- CreateEnum
CREATE TYPE "SourceApi" AS ENUM ('TMDB', 'TICKETMASTER');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('RASCUNHO', 'PUBLICADO');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('RESERVADO', 'PAGO', 'VALIDADO');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDENTE', 'PAGO', 'CANCELADO');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "imagem" TEXT,
    "tipo" "EventType" NOT NULL,
    "sourceApi" "SourceApi" NOT NULL,
    "externalId" TEXT NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'RASCUNHO',
    "organizadorId" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" TIMESTAMP(3) NOT NULL,
    "local" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeatMap" (
    "id" SERIAL NOT NULL,
    "layout" JSONB NOT NULL,
    "sessionId" INTEGER NOT NULL,

    CONSTRAINT "SeatMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assento" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'RESERVADO',
    "qrCode" TEXT NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDENTE',
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" SERIAL NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticketId" INTEGER NOT NULL,
    "portariaId" INTEGER NOT NULL,

    CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SeatMap_sessionId_key" ON "SeatMap"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_qrCode_key" ON "Ticket"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "CheckIn_ticketId_key" ON "CheckIn"("ticketId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizadorId_fkey" FOREIGN KEY ("organizadorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatMap" ADD CONSTRAINT "SeatMap_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_portariaId_fkey" FOREIGN KEY ("portariaId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

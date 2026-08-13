/*
  Warnings:

  - A unique constraint covering the columns `[shareToken]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "TicketStatus" ADD VALUE 'CANCELADO';

ALTER TABLE "Ticket" ADD COLUMN "shareToken" TEXT;

CREATE UNIQUE INDEX "Ticket_shareToken_key" ON "Ticket"("shareToken");
import prisma from "../lib/prisma.js";

class CheckinService {
  async validar({ qrCode, portariaId }) {
    if (!qrCode) {
      throw new Error("Informe o código do ingresso");
    }

    const ticket = await prisma.ticket.findUnique({
      where: { qrCode },
      include: { checkin: true },
    });

    if (!ticket) {
      throw new Error("Ingresso não encontrado");
    }

    if (ticket.status !== "PAGO") {
      throw new Error(`Ingresso com status inválido para entrada: ${ticket.status}`);
    }

    if (ticket.checkin) {
      throw new Error("Ingresso já foi utilizado anteriormente");
    }
    
    return prisma.$transaction(async (tx) => {
      const checkin = await tx.checkIn.create({
        data: {
          ticketId: ticket.id,
          portariaId,
        },
      });

      await tx.ticket.update({
        where: { id: ticket.id },
        data: { status: "VALIDADO" },
      });

      return { liberado: true, checkin, ticket };
    });
  }
}

export default new CheckinService();
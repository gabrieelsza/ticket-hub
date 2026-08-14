import prisma from "../lib/prisma.js";
import { codigoEhValido } from "../utils/qrcode.util.js";

class CheckinService {
  async validar({ qrCode, portariaId }) {
    if (!qrCode) {
      const error = new Error("Informe o código do ingresso");
      error.statusCode = 400;
      throw error;
    }

    if (!codigoEhValido(qrCode)) {
      const error = new Error("Código inválido ou adulterado");
      error.statusCode = 400;
      throw error;
    }

    const ticket = await prisma.ticket.findUnique({
      where: { qrCode },
      include: { checkin: true },
    });

    if (!ticket) {
      const error = new Error("Ingresso não encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (ticket.status === "VALIDADO") {
      const error = new Error("Check-in já realizado para este ingresso");
      error.statusCode = 409;
      throw error;
    }

    if (ticket.status !== "PAGO") {
      const error = new Error(
        `Ingresso com status inválido para entrada: ${ticket.status}`
      );
      error.statusCode = 400;
      throw error;
    }

    return prisma.$transaction(async (tx) => {
      const checkin = await tx.checkIn.create({
        data: {
          ticketId: ticket.id,
          portariaId,
        },
      });

      const ticketAtualizado = await tx.ticket.update({
        where: { id: ticket.id },
        data: { status: "VALIDADO" },
      });

      return { liberado: true, checkin, ticket: ticketAtualizado };
    });
  }
}

export default new CheckinService();
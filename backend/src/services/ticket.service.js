import { randomUUID } from "crypto";
import prisma from "../lib/prisma.js";

class TicketService {
  async comprar({ sessionId, assentos, clienteId }) {
    if (!sessionId || !assentos || assentos.length === 0) {
      throw new Error("Informe a sessão e ao menos um assento");
    }

    return prisma.$transaction(async (tx) => {
      const seatMap = await tx.seatMap.findUnique({
        where: { sessionId: Number(sessionId) },
      });

      if (!seatMap) {
        throw new Error("Mapa de assentos não encontrado para esta sessão");
      }

      const layout = seatMap.layout;

      
      const assentosAtualizados = layout.assentos.map((assento) => {
        if (assentos.includes(assento.codigo)) {
          if (assento.status === "OCUPADO") {
            throw new Error(`Assento ${assento.codigo} já está ocupado`);
          }
          return { ...assento, status: "OCUPADO" };
        }
        return assento;
      });

      
      const codigosValidos = layout.assentos.map((a) => a.codigo);
      const algumInvalido = assentos.some((codigo) => !codigosValidos.includes(codigo));
      if (algumInvalido) {
        throw new Error("Um ou mais assentos informados não existem nesta sessão");
      }

      
      await tx.seatMap.update({
        where: { id: seatMap.id },
        data: { layout: { assentos: assentosAtualizados } },
      });

      
      const valorTotal = assentos.length * 30; 
      const order = await tx.order.create({
        data: {
          clienteId,
          valorTotal,
          status: "PAGO", 
        },
      });

      
      const tickets = await Promise.all(
        assentos.map((codigo) =>
          tx.ticket.create({
            data: {
              sessionId: Number(sessionId),
              clienteId,
              assento: codigo,
              status: "PAGO",
              qrCode: randomUUID(),
              orderId: order.id,
            },
          })
        )
      );

      return { order, tickets };
    });
  }

  async listarPorCliente(clienteId) {
    return prisma.ticket.findMany({
      where: { clienteId },
      include: { session: { include: { event: true } } },
    });
  }
}

export default new TicketService();
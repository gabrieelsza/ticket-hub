import { randomUUID } from "crypto";
import { gerarCodigoSeguro } from "../utils/qrcode.util.js";
import prisma from "../lib/prisma.js";

class TicketService {
  async reservar({ sessionId, assentos, clienteId }) {
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
      const codigosValidos = layout.assentos.map((a) => a.codigo);
      const algumInvalido = assentos.some((codigo) => !codigosValidos.includes(codigo));
      if (algumInvalido) {
        throw new Error("Um ou mais assentos informados não existem nesta sessão");
      }

      const assentosAtualizados = layout.assentos.map((assento) => {
        if (assentos.includes(assento.codigo)) {
          if (assento.status === "OCUPADO") {
            throw new Error(`Assento ${assento.codigo} já está ocupado`);
          }
          return { ...assento, status: "OCUPADO" }; // já bloqueia aqui, evita concorrência
        }
        return assento;
      });

      await tx.seatMap.update({
        where: { id: seatMap.id },
        data: { layout: { assentos: assentosAtualizados } },
      });

      const valorTotal = assentos.length * 30;

      const order = await tx.order.create({
        data: { clienteId, valorTotal, status: "PENDENTE" },
      });

      const tickets = await Promise.all(
        assentos.map((codigo) =>
          tx.ticket.create({
            data: {
              sessionId: Number(sessionId),
              clienteId,
              assento: codigo,
              status: "RESERVADO",
              qrCode: gerarCodigoSeguro(),
              shareToken: randomUUID(),
              orderId: order.id,
            },
          })
        )
      );

      return { order, tickets };
    });
  }

  async confirmarPagamento({ orderId, aprovado, clienteId }) {
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: { tickets: true },
    });

    if (!order) throw new Error("Pedido não encontrado");
    if (order.clienteId !== clienteId) throw new Error("Este pedido não pertence a você");
    if (order.status !== "PENDENTE") throw new Error("Este pedido já foi processado");

    if (aprovado) {
      return prisma.$transaction(async (tx) => {
        await tx.order.update({ where: { id: order.id }, data: { status: "PAGO" } });

        const tickets = await Promise.all(
          order.tickets.map((t) =>
            tx.ticket.update({ where: { id: t.id }, data: { status: "PAGO" } })
          )
        );

        return { order: { ...order, status: "PAGO" }, tickets };
      });
    }

    return prisma.$transaction(async (tx) => {
      const primeiroTicket = order.tickets[0];
      const seatMap = await tx.seatMap.findUnique({
        where: { sessionId: primeiroTicket.sessionId },
      });

      const codigosCancelados = order.tickets.map((t) => t.assento);
      const layoutLiberado = {
        assentos: seatMap.layout.assentos.map((assento) =>
          codigosCancelados.includes(assento.codigo)
            ? { ...assento, status: "DISPONIVEL" }
            : assento
        ),
      };

      await tx.seatMap.update({ where: { id: seatMap.id }, data: { layout: layoutLiberado } });
      await tx.order.update({ where: { id: order.id }, data: { status: "CANCELADO" } });

      const tickets = await Promise.all(
        order.tickets.map((t) =>
          tx.ticket.update({ where: { id: t.id }, data: { status: "CANCELADO" } })
        )
      );

      return { order: { ...order, status: "CANCELADO" }, tickets };
    });
  }

  async listarPorCliente(clienteId) {
    return prisma.ticket.findMany({
      where: { clienteId },
      include: { session: { include: { event: true } } },
    });
  }

  async listarPorCliente(clienteId) {
    return prisma.ticket.findMany({
      where: { clienteId },
      include: { session: { include: { event: true } } },
    });
  }

  async buscarPorShareToken(shareToken) {
    const ticket = await prisma.ticket.findUnique({
      where: { shareToken },
      include: { session: { include: { event: true } } },
    });

    if (!ticket) throw new Error("Ingresso não encontrado");

    return ticket;
  }
}
export default new TicketService();
import prisma from "../lib/prisma.js";

// GERA lAYOUT: Fileiras de A a E, 8 assentos cada
function gerarLayoutPadrao() {
  const fileiras = ["A", "B", "C", "D", "E"];
  const assentosPorFileira = 8;

  const assentos = [];

  for (const fileira of fileiras) {
    for (let numero = 1; numero <= assentosPorFileira; numero++) {
      assentos.push({
        codigo: `${fileira}${numero}`,
        status: "DISPONIVEL", // DISPONIVEL | OCUPADO
      });
    }
  }

  return { assentos };
}

class SessionService {
  async criar({ eventId, data, hora, local, organizadorId }) {
    if (!eventId || !data || !hora || !local) {
      throw new Error("Dados obrigatórios faltando (eventId, data, hora, local)");
    }

    const evento = await prisma.event.findUnique({ where: { id: Number(eventId) } });

    if (!evento) {
      throw new Error("Evento não encontrado");
    }

    if (evento.organizadorId !== organizadorId) {
      throw new Error("Você não tem permissão para criar sessões neste evento");
    }

    // JUNTA DATA + HORA
    const dataHora = new Date(`${data}T${hora}`);

    const session = await prisma.session.create({
      data: {
        eventId: Number(eventId),
        data: dataHora,
        local,
        seatMap: {
          create: {
            layout: gerarLayoutPadrao(),
          },
        },
      },
      include: { seatMap: true },
    });

    return session;
  }

  async listarPorEvento(eventId) {
    return prisma.session.findMany({
      where: { eventId: Number(eventId) },
      include: { seatMap: true },
    });
  }

  async buscarPorId(id) {
    const session = await prisma.session.findUnique({
      where: { id: Number(id) },
      include: { seatMap: true, event: true },
    });

    if (!session) {
      throw new Error("Sessão não encontrada");
    }

    return session;
  }

  async buscarSeatMap(sessionId) {
    const seatMap = await prisma.seatMap.findUnique({
      where: { sessionId: Number(sessionId) },
    });

    if (!seatMap) {
      throw new Error("Mapa de assentos não encontrado para esta sessão");
    }

    return seatMap;
  }
}

export default new SessionService();
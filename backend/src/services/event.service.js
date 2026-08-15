import prisma from "../lib/prisma.js";
import tmdbService from "./tmdb.service.js";
import ticketmasterService from "./ticketmaster.service.js";

class EventService {
  async buscarNaApiExterna({ fonte, query }) {
    if (!fonte || !query) {
      throw new Error("Informe 'fonte' e 'query' na busca");
    }

    if (fonte === "tmdb") {
      return tmdbService.buscarFilmes(query);
    }

    if (fonte === "ticketmaster") {
      return ticketmasterService.buscarEventos(query);
    }

    throw new Error("Fonte inválida. Use 'tmdb' ou 'ticketmaster'");
  }

  async importar({
    titulo,
    descricao,
    imagem,
    tipo,
    sourceApi,
    externalId,
    organizadorId,
  }) {
    if (!titulo || !tipo || !sourceApi || !externalId) {
      throw new Error("Dados obrigatórios faltando");
    }

    return prisma.event.create({
      data: {
        titulo,
        descricao,
        imagem,
        tipo,
        sourceApi,
        externalId,
        status: "RASCUNHO",
        organizadorId,
      },
    });
  }


  async publicar({ id, organizadorId }) {
    const evento = await prisma.event.findUnique({
      where: { id: String(id) },
    });

    if (!evento) {
      throw new Error("Evento não encontrado");
    }

    if (evento.organizadorId !== organizadorId) {
      throw new Error("Você não tem permissão para publicar este evento");
    }

    return prisma.event.update({
      where: { id: String(id) },
      data: { status: "PUBLICADO" },
    });
  }

  async buscarPorId(id) {
    const evento = await prisma.event.findUnique({
      where: { id: String(id) },
      include: {
        sessions: {
          include: { seatMap: true },
        },
      },
    });

    if (!evento) {
      throw new Error("Evento não encontrado");
    }

    return evento;
  }

  async listarPublicados() {
    return prisma.event.findMany({
      where: { status: "PUBLICADO" },
      include: {
        sessions: {
          include: { seatMap: true },
        },
      },
    });
  }

  async listarMeus(organizadorId) {
    return prisma.event.findMany({
      where: { organizadorId },
      include: { sessions: true },
    });
  }
}

export default new EventService();
const TICKETMASTER_BASE_URL = "https://app.ticketmaster.com/discovery/v2";

class TicketmasterService {
  async buscarEventos(query) {
    const url = `${TICKETMASTER_BASE_URL}/events.json?keyword=${encodeURIComponent(
      query
    )}&apikey=${process.env.TICKETMASTER_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao buscar eventos na Ticketmaster");
    }

    const data = await response.json();

    if (!data._embedded) return [];

    return data._embedded.events.map((evento) => ({
      externalId: evento.id,
      titulo: evento.name,
      descricao: evento.info || "",
      imagem: evento.images?.[0]?.url || null,
      tipo: "SHOW",
      sourceApi: "TICKETMASTER",
    }));
  }
}

export default new TicketmasterService();
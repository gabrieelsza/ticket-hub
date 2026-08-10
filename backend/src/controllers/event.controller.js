import eventService from "../services/event.service.js";

class EventController {
  async buscarNaApiExterna(req, res) {
    try {
      const { fonte, query } = req.query;
      const resultados = await eventService.buscarNaApiExterna({ fonte, query });
      return res.status(200).json(resultados);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async importar(req, res) {
    try {
      const { titulo, descricao, imagem, tipo, sourceApi, externalId } = req.body || {};

      const evento = await eventService.importar({
        titulo,
        descricao,
        imagem,
        tipo,
        sourceApi,
        externalId,
        organizadorId: req.user.id,
      });

      return res.status(201).json(evento);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async publicar(req, res) {
    try {
      const { id } = req.params;

      const evento = await eventService.publicar({
        id,
        organizadorId: req.user.id,
      });

      return res.status(200).json(evento);
    } catch (error) {
      return res.status(403).json({ message: error.message });
    }
  }

  async listarPublicados(req, res) {
    try {
      const eventos = await eventService.listarPublicados();
      return res.status(200).json(eventos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async listarMeus(req, res) {
    try {
      const eventos = await eventService.listarMeus(req.user.id);
      return res.status(200).json(eventos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new EventController();
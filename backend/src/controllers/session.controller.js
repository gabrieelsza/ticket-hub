import sessionService from "../services/session.service.js";

class SessionController {
  async criar(req, res) {
    try {
      const { eventId } = req.params;
      const { data, hora, local } = req.body || {};

      const session = await sessionService.criar({
        eventId,
        data,
        hora,
        local,
        organizadorId: req.user.id,
      });

      return res.status(201).json(session);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async listarPorEvento(req, res) {
    try {
      const { eventId } = req.params;
      const sessions = await sessionService.listarPorEvento(eventId);
      return res.status(200).json(sessions);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const session = await sessionService.buscarPorId(id);
      return res.status(200).json(session);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async buscarSeatMap(req, res) {
    try {
      const { id } = req.params;
      const seatMap = await sessionService.buscarSeatMap(id);
      return res.status(200).json(seatMap);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }
}

export default new SessionController();
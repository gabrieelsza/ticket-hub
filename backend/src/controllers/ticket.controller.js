import ticketService from "../services/ticket.service.js";

class TicketController {
  async comprar(req, res) {
    try {
      const { sessionId, assentos } = req.body || {};

      const resultado = await ticketService.comprar({
        sessionId,
        assentos,
        clienteId: req.user.id,
      });

      return res.status(201).json(resultado);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async meusIngressos(req, res) {
    try {
      const tickets = await ticketService.listarPorCliente(req.user.id);
      return res.status(200).json(tickets);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new TicketController();
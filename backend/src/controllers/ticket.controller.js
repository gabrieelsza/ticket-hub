import ticketService from "../services/ticket.service.js";

class TicketController {
  async reservar(req, res) {
    try {
      const { sessionId, assentos } = req.body || {};
      const resultado = await ticketService.reservar({ sessionId, assentos, clienteId: req.user.id });
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

  async confirmarPagamento(req, res) {
    try {
      const { orderId } = req.params;
      const { aprovado } = req.body || {};
      const resultado = await ticketService.confirmarPagamento({
        orderId,
        aprovado: Boolean(aprovado),
        clienteId: req.user.id,
      });
      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async buscarPorShareToken(req, res) {
      try {
        const { shareToken } = req.params;
        const ticket = await ticketService.buscarPorShareToken(shareToken);
        return res.status(200).json(ticket);
      } catch (error) {
        return res.status(404).json({ message: error.message });
      }
    }
  }

export default new TicketController();
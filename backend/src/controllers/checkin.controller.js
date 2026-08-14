import checkinService from "../services/checkin.service.js";

class CheckinController {
  async validar(req, res) {
    try {
      const { qrCode } = req.body || {};

      const resultado = await checkinService.validar({
        qrCode,
        portariaId: req.user.id,
      });

      return res.status(200).json(resultado);
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(409).json({
          message: "Ingresso já foi utilizado anteriormente",
        });
      }

      return res.status(error.statusCode || 400).json({
        message: error.message,
      });
    }
  }
}

export default new CheckinController();
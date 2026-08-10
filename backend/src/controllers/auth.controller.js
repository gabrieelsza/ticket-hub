import authService from "../services/auth.service.js";

class AuthController {
  async register(req, res) {
    try {
      const { nome, email, senha, role } = req.body || {};

      const result = await authService.register({
        nome,
        email,
        senha,
        role,
      });

      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const result = await authService.login({
        email,
        senha,
      });

      return res.status(200).json(result);
    } catch (error) {
      return res.status(401).json({
        message: error.message,
      });
    }
  }
}

export default new AuthController();
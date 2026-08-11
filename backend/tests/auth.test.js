import { jest } from "@jest/globals";
import request from "supertest";
import createApp from "../src/app.js";

jest.setTimeout(30000);

const app = createApp();

describe("Autenticação", () => {
  it("deve rejeitar login com credenciais inválidas", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "naoexiste@teste.com", senha: "senhaerrada" });

    expect(response.status).toBe(401);
  });
});
import request from "supertest";
import createApp  from "../src/app.js";
import prisma from "../src/lib/prisma.js";

const app = createApp();

describe("Compra de ingresso", () => {
  let tokenCliente;
  let sessionId;

  beforeAll(async () => {
    const emailTeste = `cliente.teste.${Date.now()}@teste.com`;

    await request(app).post("/api/auth/register").send({
      nome: "Cliente Teste",
      email: emailTeste,
      senha: "123456",
      role: "CLIENTE",
    });

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: emailTeste, senha: "123456" });

    tokenCliente = login.body.token;

    const emailOrganizador = `organizador.teste.${Date.now()}@teste.com`;

    await request(app).post("/api/auth/register").send({
      nome: "Organizador Teste",
      email: emailOrganizador,
      senha: "123456",
      role: "ORGANIZADOR",
    });

    const loginOrganizador = await request(app)
      .post("/api/auth/login")
      .send({ email: emailOrganizador, senha: "123456" });

    const tokenOrganizador = loginOrganizador.body.token;

    const evento = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${tokenOrganizador}`)
      .send({
        titulo: "Evento de Teste",
        tipo: "FILME",
        sourceApi: "TMDB",
        externalId: `teste-${Date.now()}`,
      });

    const session = await request(app)
      .post(`/api/sessions/evento/${evento.body.id}`)
      .set("Authorization", `Bearer ${tokenOrganizador}`)
      .send({ data: "2026-12-20", hora: "20:00", local: "Sala Teste" });

    sessionId = session.body.id;
  }, 60000);

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("deve impedir a compra de um assento já ocupado", async () => {
    const primeira = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${tokenCliente}`)
      .send({ sessionId, assentos: ["A1"] });

    expect([200, 201]).toContain(primeira.status);

    const segunda = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${tokenCliente}`)
      .send({ sessionId, assentos: ["A1"] });

    expect(segunda.status).toBe(400);
    expect(segunda.body.message).toMatch(/já está ocupado/i);
  });
});
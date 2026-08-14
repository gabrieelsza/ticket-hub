import request from "supertest";
import createApp from "../src/app.js";
import prisma from "../src/lib/prisma.js";

const app = createApp();

describe("Check-in", () => {
  let tokenPortaria;
  let qrCode;

  beforeAll(async () => {
    const emailOrganizador = `organizador.checkin.${Date.now()}@teste.com`;
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
        titulo: "Evento Checkin Teste",
        tipo: "FILME",
        sourceApi: "TMDB",
        externalId: `checkin-teste-${Date.now()}`,
      });

    const session = await request(app)
      .post(`/api/sessions/evento/${evento.body.id}`)
      .set("Authorization", `Bearer ${tokenOrganizador}`)
      .send({ data: "2026-12-20", hora: "20:00", local: "Sala Teste" });

    const emailCliente = `cliente.checkin.${Date.now()}@teste.com`;
    await request(app).post("/api/auth/register").send({
      nome: "Cliente Teste",
      email: emailCliente,
      senha: "123456",
      role: "CLIENTE",
    });
    const loginCliente = await request(app)
      .post("/api/auth/login")
      .send({ email: emailCliente, senha: "123456" });

    const compra = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${loginCliente.body.token}`)
      .send({ sessionId: session.body.id, assentos: ["B1"] });

    qrCode = compra.body.tickets[0].qrCode;

    await prisma.ticket.update({
      where: { qrCode },
      data: { status: "PAGO" },
    });

    const emailPortaria = `portaria.teste.${Date.now()}@teste.com`;
    await request(app).post("/api/auth/register").send({
      nome: "Portaria Teste",
      email: emailPortaria,
      senha: "123456",
      role: "PORTARIA",
    });

    const loginPortaria = await request(app)
      .post("/api/auth/login")
      .send({ email: emailPortaria, senha: "123456" });

    tokenPortaria = loginPortaria.body.token;
  }, 60000);

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("deve impedir check-in duplicado do mesmo ingresso", async () => {
    const primeira = await request(app)
      .post("/api/checkin")
      .set("Authorization", `Bearer ${tokenPortaria}`)
      .send({ qrCode });

    console.log("CHECKIN 1 STATUS:", primeira.status);
    console.log("CHECKIN 1 BODY:", primeira.body);

    expect(primeira.status).toBe(200);

    const segunda = await request(app)
      .post("/api/checkin")
      .set("Authorization", `Bearer ${tokenPortaria}`)
      .send({ qrCode });

    console.log("CHECKIN 2 STATUS:", segunda.status);
    console.log("CHECKIN 2 BODY:", segunda.body);

    expect(segunda.status).toBe(409);
  });
});
import { jest } from "@jest/globals";
import request from "supertest";
import createApp from "../src/app.js";
import prisma from "../src/lib/prisma.js";

jest.setTimeout(30000);

const app = createApp();

describe("Compra de ingresso", () => {
  let tokenCliente;
  let sessionId;
  const assento = "Z88";

  beforeAll(async () => {
    const seatMap = await prisma.seatMap.findUnique({
        where: { sessionId: 1 },
    });

    expect(seatMap).toBeTruthy();

    const livre = seatMap.layout.assentos.find((a) => a.status !== "OCUPADO");
    expect(livre).toBeTruthy();

    sessionId = 1;
    assentoLivre = livre.codigo;
  });

  it("deve impedir a compra de um assento já ocupado", async () => {
    const primeira = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${tokenCliente}`)
      .send({ sessionId, assentos: [assentoLivre] });

    const segunda = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${tokenCliente}`)
      .send({ sessionId, assentos: [assentoLivre] });

    console.log("PRIMEIRA COMPRA:", primeira.status, primeira.body);
    console.log("SEGUNDA COMPRA:", segunda.status, segunda.body);

    expect([200, 201]).toContain(primeira.status);
    expect(segunda.status).toBe(400);
    expect(segunda.body.message).toMatch(/já está ocupado/i);
  });
});
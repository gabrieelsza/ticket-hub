import { jest } from "@jest/globals";
import request from "supertest";
import createApp from "../src/app.js";
import prisma from "../src/lib/prisma.js";

jest.setTimeout(30000);

const app = createApp();

describe("Check-in", () => {
  let tokenPortaria;
  let qrCode;

  beforeAll(async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "portaria@teste.com", senha: "123456" });

    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();

    tokenPortaria = login.body.token;

    const ticket = await prisma.ticket.findFirst({
      where: {
        status: "PAGO",
      },
    });

    expect(ticket).toBeTruthy();
    qrCode = ticket.qrCode;
  });

  it("deve impedir check-in duplicado do mesmo ingresso", async () => {
    const primeira = await request(app)
      .post("/api/checkin")
      .set("Authorization", `Bearer ${tokenPortaria}`)
      .send({ qrCode });

    const segunda = await request(app)
      .post("/api/checkin")
      .set("Authorization", `Bearer ${tokenPortaria}`)
      .send({ qrCode });

    console.log("PRIMEIRO CHECKIN:", primeira.status, primeira.body);
    console.log("SEGUNDO CHECKIN:", segunda.status, segunda.body);

    expect([200, 201]).toContain(primeira.status);
    expect(segunda.status).toBe(400);
    expect(segunda.body.message).toMatch(/status inválido|VALIDADO/i);
  });
});
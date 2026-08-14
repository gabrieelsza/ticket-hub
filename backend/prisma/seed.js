import prisma from "../src/lib/prisma.js";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

function gerarLayoutPadrao() {
  const fileiras = ["A", "B", "C", "D", "E"];
  const assentos = [];
  for (const fileira of fileiras) {
    for (let numero = 1; numero <= 8; numero++) {
      assentos.push({ codigo: `${fileira}${numero}`, status: "DISPONIVEL" });
    }
  }
  return { assentos };
}

async function main() {
  const senhaHash = await bcrypt.hash("123456", 10);

  const organizador = await prisma.user.upsert({
    where: { email: "organizador@tickethub.com" },
    update: {},
    create: {
      nome: "Ana Organizadora",
      email: "organizador@tickethub.com",
      senha: senhaHash,
      role: "ORGANIZADOR",
    },
  });

  const cliente1 = await prisma.user.upsert({
    where: { email: "cliente1@tickethub.com" },
    update: {},
    create: {
      nome: "Bruno Cliente",
      email: "cliente1@tickethub.com",
      senha: senhaHash,
      role: "CLIENTE",
    },
  });

  const cliente2 = await prisma.user.upsert({
    where: { email: "cliente2@tickethub.com" },
    update: {},
    create: {
      nome: "Carla Cliente",
      email: "cliente2@tickethub.com",
      senha: senhaHash,
      role: "CLIENTE",
    },
  });

  await prisma.user.upsert({
    where: { email: "portaria@tickethub.com" },
    update: {},
    create: {
      nome: "Diego Portaria",
      email: "portaria@tickethub.com",
      senha: senhaHash,
      role: "PORTARIA",
    },
  });

  // Evento publicado, com uma sessão e assentos disponíveis
  const evento = await prisma.event.create({
    data: {
      titulo: "Campo de Silêncio",
      descricao:
        "Uma engenheira aeroespacial retorna à fazenda da família na véspera do último lançamento tripulado.",
      imagem: "https://image.tmdb.org/t/p/w500/exemplo.jpg",
      tipo: "FILME",
      sourceApi: "TMDB",
      externalId: "seed-campo-silencio",
      status: "PUBLICADO",
      organizadorId: organizador.id,
    },
  });

  const session = await prisma.session.create({
    data: {
      eventId: evento.id,
      data: new Date("2026-08-25T20:00:00"),
      local: "Cine Belas Artes — Sala 1",
      seatMap: { create: { layout: gerarLayoutPadrao() } },
    },
    include: { seatMap: true },
  });

  // Um ingresso já comprado pelo cliente1, pra ter algo em "Meus Ingressos" e testar check-in
  const order = await prisma.order.create({
    data: { clienteId: cliente1.id, valorTotal: 30, status: "PAGO" },
  });

  await prisma.ticket.create({
    data: {
      sessionId: session.id,
      clienteId: cliente1.id,
      assento: "A1",
      status: "PAGO",
      qrCode: randomUUID(),
      shareToken: randomUUID(),
      orderId: order.id,
    },
  });

  console.log("Seed concluído:");
  console.log("- Organizador: organizador@tickethub.com / 123456");
  console.log("- Cliente 1: cliente1@tickethub.com / 123456 (já tem 1 ingresso comprado)");
  console.log("- Cliente 2: cliente2@tickethub.com / 123456");
  console.log("- Portaria: portaria@tickethub.com / 123456");
  console.log(`- Evento publicado: "${evento.titulo}" com sessão em 25/08 às 20h`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
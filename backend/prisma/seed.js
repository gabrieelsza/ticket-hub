import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma.js";

async function main() {
  const senha = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: { email: "cliente@teste.com" },
    update: {
      senha,
      nome: "Cliente Teste",
      role: "CLIENTE",
    },
    create: {
      email: "cliente@teste.com",
      senha,
      nome: "Cliente Teste",
      role: "CLIENTE",
    },
  });

  await prisma.user.upsert({
    where: { email: "portaria@teste.com" },
    update: {
      senha,
      nome: "Portaria Teste",
      role: "PORTARIA",
    },
    create: {
      email: "portaria@teste.com",
      senha,
      nome: "Portaria Teste",
      role: "PORTARIA",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
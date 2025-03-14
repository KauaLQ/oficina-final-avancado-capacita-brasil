import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const disciplinas = ['Informática Básica', 'Programação Orientada a Objetos', 'Desenvolvimento Web', 'Java com SpringBoot', 'Banco de Dados'];

  for (const nome of disciplinas) {
    await prisma.disciplina.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }

  console.log('Disciplinas inseridas!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
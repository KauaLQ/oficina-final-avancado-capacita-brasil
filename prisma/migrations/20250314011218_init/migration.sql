-- DropForeignKey
ALTER TABLE "Boletim" DROP CONSTRAINT "Boletim_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "Boletim" DROP CONSTRAINT "Boletim_disciplinaId_fkey";

-- AddForeignKey
ALTER TABLE "Boletim" ADD CONSTRAINT "Boletim_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boletim" ADD CONSTRAINT "Boletim_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

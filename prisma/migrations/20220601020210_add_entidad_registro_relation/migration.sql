/*
  Warnings:

  - Added the required column `entidadId` to the `Registro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registro" ADD COLUMN     "entidadId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "Entidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

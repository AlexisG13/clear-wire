/*
  Warnings:

  - Added the required column `transactionHash` to the `Registro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registro" ADD COLUMN     "transactionHash" TEXT NOT NULL;

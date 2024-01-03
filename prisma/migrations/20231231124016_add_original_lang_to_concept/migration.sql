/*
  Warnings:

  - Added the required column `languageId` to the `Concept` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Concept" ADD COLUMN     "languageId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Concept" ADD CONSTRAINT "Concept_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

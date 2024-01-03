/*
  Warnings:

  - Added the required column `conceptId` to the `TranslatedConcept` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TranslatedConcept" ADD COLUMN     "conceptId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TranslatedConcept" ADD CONSTRAINT "TranslatedConcept_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

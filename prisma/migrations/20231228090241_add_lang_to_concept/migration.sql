/*
  Warnings:

  - Added the required column `languageId` to the `TranslatedConcept` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TranslatedConcept" ADD COLUMN     "languageId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TranslatedConcept" ADD CONSTRAINT "TranslatedConcept_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

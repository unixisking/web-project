-- DropForeignKey
ALTER TABLE "Concept" DROP CONSTRAINT "Concept_languageId_fkey";

-- AlterTable
ALTER TABLE "TranslatedConcept" ADD COLUMN     "original" BOOLEAN NOT NULL DEFAULT false;

-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_conceptId_fkey";

-- AlterTable
ALTER TABLE "Component" ADD COLUMN     "translatedConceptId" INTEGER;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_translatedConceptId_fkey" FOREIGN KEY ("translatedConceptId") REFERENCES "TranslatedConcept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

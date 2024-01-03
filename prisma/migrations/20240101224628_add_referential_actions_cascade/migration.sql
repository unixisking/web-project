-- DropForeignKey
ALTER TABLE "TranslatedConcept" DROP CONSTRAINT "TranslatedConcept_conceptId_fkey";

-- DropForeignKey
ALTER TABLE "TranslatedConcept" DROP CONSTRAINT "TranslatedConcept_userId_fkey";

-- AddForeignKey
ALTER TABLE "TranslatedConcept" ADD CONSTRAINT "TranslatedConcept_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslatedConcept" ADD CONSTRAINT "TranslatedConcept_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

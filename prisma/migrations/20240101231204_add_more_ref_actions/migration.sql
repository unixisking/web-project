-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_conceptId_fkey";

-- DropForeignKey
ALTER TABLE "TranslatedComponent" DROP CONSTRAINT "TranslatedComponent_componentId_fkey";

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslatedComponent" ADD CONSTRAINT "TranslatedComponent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

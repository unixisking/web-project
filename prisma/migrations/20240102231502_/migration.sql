/*
  Warnings:

  - You are about to drop the column `translatedConceptId` on the `Component` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_translatedConceptId_fkey";

-- AlterTable
ALTER TABLE "Component" DROP COLUMN "translatedConceptId";

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

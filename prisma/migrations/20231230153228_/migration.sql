/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Concept` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Concept_slug_key" ON "Concept"("slug");

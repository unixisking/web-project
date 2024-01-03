/*
  Warnings:

  - Added the required column `conceptPhotoPath` to the `TranslatedConcept` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TranslatedConcept" ADD COLUMN     "conceptPhotoPath" TEXT NOT NULL;

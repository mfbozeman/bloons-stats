/*
  Warnings:

  - Added the required column `cost` to the `tower` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attack" ADD COLUMN     "buffs" JSONB;

-- AlterTable
ALTER TABLE "projectile" ADD COLUMN     "modifiers" JSONB;

-- AlterTable
ALTER TABLE "tower" ADD COLUMN     "cost" INTEGER NOT NULL;

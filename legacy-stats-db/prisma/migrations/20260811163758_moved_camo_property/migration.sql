/*
  Warnings:

  - You are about to drop the column `camo` on the `projectile` table. All the data in the column will be lost.
  - Added the required column `camo` to the `attack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attack" ADD COLUMN     "camo" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "projectile" DROP COLUMN "camo";

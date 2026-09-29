/*
  Warnings:

  - You are about to drop the `Attack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Projectile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StatBlock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tower` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Upgrade` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attack" DROP CONSTRAINT "Attack_statId_fkey";

-- DropForeignKey
ALTER TABLE "Projectile" DROP CONSTRAINT "Projectile_attackId_fkey";

-- DropForeignKey
ALTER TABLE "StatBlock" DROP CONSTRAINT "StatBlock_towerId_fkey";

-- DropForeignKey
ALTER TABLE "Upgrade" DROP CONSTRAINT "Upgrade_towerId_fkey";

-- DropTable
DROP TABLE "Attack";

-- DropTable
DROP TABLE "Projectile";

-- DropTable
DROP TABLE "StatBlock";

-- DropTable
DROP TABLE "Tower";

-- DropTable
DROP TABLE "Upgrade";

-- CreateTable
CREATE TABLE "tower" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "tower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upgrade" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "towerId" TEXT NOT NULL,
    "path" INTEGER NOT NULL,
    "tier" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "upgrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statBlock" (
    "towerId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "path1" INTEGER NOT NULL,
    "path2" INTEGER NOT NULL,
    "path3" INTEGER NOT NULL,
    "land" BOOLEAN NOT NULL,
    "water" BOOLEAN NOT NULL,
    "range" INTEGER NOT NULL,
    "footprint" INTEGER NOT NULL,
    "subtowers" JSONB,

    CONSTRAINT "statBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attack" (
    "id" SERIAL NOT NULL,
    "statId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "count" INTEGER NOT NULL,
    "attackRange" INTEGER NOT NULL,

    CONSTRAINT "attack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projectile" (
    "id" SERIAL NOT NULL,
    "attackId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "pierce" DOUBLE PRECISION NOT NULL,
    "damage" INTEGER NOT NULL,
    "radius" INTEGER NOT NULL,
    "bloonImmunities" INTEGER NOT NULL,
    "camo" BOOLEAN NOT NULL,
    "speed" INTEGER NOT NULL,
    "lifespan" DOUBLE PRECISION NOT NULL,
    "effects" JSONB,

    CONSTRAINT "projectile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "upgrade" ADD CONSTRAINT "upgrade_towerId_fkey" FOREIGN KEY ("towerId") REFERENCES "tower"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statBlock" ADD CONSTRAINT "statBlock_towerId_fkey" FOREIGN KEY ("towerId") REFERENCES "tower"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attack" ADD CONSTRAINT "attack_statId_fkey" FOREIGN KEY ("statId") REFERENCES "statBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projectile" ADD CONSTRAINT "projectile_attackId_fkey" FOREIGN KEY ("attackId") REFERENCES "attack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

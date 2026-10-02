-- CreateTable
CREATE TABLE "Tower" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Tower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upgrade" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "towerId" TEXT NOT NULL,
    "path" INTEGER NOT NULL,
    "tier" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Upgrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatBlock" (
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

    CONSTRAINT "StatBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attack" (
    "id" SERIAL NOT NULL,
    "statId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "count" INTEGER NOT NULL,
    "attackRange" INTEGER NOT NULL,

    CONSTRAINT "Attack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projectile" (
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

    CONSTRAINT "Projectile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Upgrade" ADD CONSTRAINT "Upgrade_towerId_fkey" FOREIGN KEY ("towerId") REFERENCES "Tower"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatBlock" ADD CONSTRAINT "StatBlock_towerId_fkey" FOREIGN KEY ("towerId") REFERENCES "Tower"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attack" ADD CONSTRAINT "Attack_statId_fkey" FOREIGN KEY ("statId") REFERENCES "StatBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projectile" ADD CONSTRAINT "Projectile_attackId_fkey" FOREIGN KEY ("attackId") REFERENCES "Attack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

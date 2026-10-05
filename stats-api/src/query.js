import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { upgrade, tower, statBlock, projectile, attack } from "./db/schema.ts";
import { relations } from "./db/relations.ts";

const db = drizzle(process.env.DATABASE_URL, { relations });

export const readTowerById = async (id) => {
  const selectTower = await db.select().from(tower).where(eq(tower.id, id));
  return selectTower;
};

export const readTowerRelations = async (id) => {
  const selectTower = await db.query.tower.findFirst({
    where: { id },
    with: {
      // upgrade: true,
      // statBlocks: { with: { attack: { with: { projectile: true } } } },
      statBlocks: { with: { attacks: { with: { projectiles: true } } } },
      // statBlocks: true,
      upgrades: true,
    },
  });
  return selectTower;
};

export const readAllTowers = async () => {
  const allTowers = await db.select().from(tower);
  return allTowers;
};

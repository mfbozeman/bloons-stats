import { defineRelations } from "drizzle-orm";
import * as schema from "./schema.ts";

export const relations = defineRelations(schema, (r) => ({
  attack: {
    statBlock: r.one.statBlock({
      from: r.attack.statId,
      to: r.statBlock.id,
    }),
    projectiles: r.many.projectile(),
  },
  statBlock: {
    attacks: r.many.attack(),
    tower: r.one.tower({
      from: r.statBlock.towerId,
      to: r.tower.id,
    }),
  },
  projectile: {
    attack: r.one.attack({
      from: r.projectile.attackId,
      to: r.attack.id,
    }),
  },
  tower: {
    statBlocks: r.many.statBlock(),
    upgrades: r.many.upgrade(),
  },
  upgrade: {
    tower: r.one.tower({
      from: r.upgrade.towerId,
      to: r.tower.id,
    }),
  },
}));

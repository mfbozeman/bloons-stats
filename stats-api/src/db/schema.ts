import {
  pgSchema,
  pgTable,
  text,
  integer,
  bigserial,
  json,
  timestamp,
  boolean,
  jsonb,
  serial,
  doublePrecision,
  index,
  foreignKey,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const attack = pgTable(
  "attack",
  {
    attackRange: integer().notNull(),
    buffs: json(),
    camo: boolean().notNull(),
    count: integer().notNull(),
    id: serial().primaryKey(),
    name: text().notNull(),
    rate: doublePrecision().notNull(),
    statId: text()
      .notNull()
      .references(() => statBlock.id),
  },
  (table) => [
    index("attack_statId_idx_c9d8da08").using(
      "btree",
      table.statId.asc().nullsLast(),
    ),
  ],
);

export const projectile = pgTable(
  "projectile",
  {
    attackId: integer()
      .notNull()
      .references(() => attack.id),
    bloonImmunities: integer().notNull(),
    count: integer().notNull(),
    damage: integer().notNull(),
    effects: json(),
    id: serial().primaryKey(),
    lifespan: doublePrecision().notNull(),
    modifiers: json(),
    name: text().notNull(),
    pierce: doublePrecision().notNull(),
    radius: integer().notNull(),
    speed: integer().notNull(),
  },
  (table) => [
    index("projectile_attackId_idx_26380785").using(
      "btree",
      table.attackId.asc().nullsLast(),
    ),
  ],
);

export const statBlock = pgTable(
  "statBlock",
  {
    abilities: json(),
    buffs: json(),
    footprint: integer().notNull(),
    id: text().primaryKey(),
    land: boolean().notNull(),
    path1: integer().notNull(),
    path2: integer().notNull(),
    path3: integer().notNull(),
    range: integer().notNull(),
    subtowers: json(),
    towerId: text()
      .notNull()
      .references(() => tower.id),
    water: boolean().notNull(),
  },
  (table) => [
    index("statBlock_towerId_idx_201afb19").using(
      "btree",
      table.towerId.asc().nullsLast(),
    ),
  ],
);

export const tower = pgTable("tower", {
  category: text().notNull(),
  cost: integer().notNull(),
  id: text().primaryKey(),
  name: text().notNull(),
});

export const upgrade = pgTable(
  "upgrade",
  {
    cost: integer().notNull(),
    id: text().primaryKey(),
    name: text().notNull(),
    path: integer().notNull(),
    tier: integer().notNull(),
    towerId: text()
      .notNull()
      .references(() => tower.id),
  },
  (table) => [
    index("upgrade_towerId_idx_201afb19").using(
      "btree",
      table.towerId.asc().nullsLast(),
    ),
  ],
);

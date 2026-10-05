import { pgSchema, pgTable, text, integer, bigserial, json, timestamp, boolean, jsonb, serial, doublePrecision, index, foreignKey, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const prismaContract = pgSchema("prisma_contract");


export const contractInPrismaContract = prismaContract.table("contract", {
	coreHash: text("core_hash").primaryKey(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	contractJson: jsonb("contract_json").notNull(),
});

export const ledgerInPrismaContract = prismaContract.table("ledger", {
	id: bigserial({ mode: 'number' }).primaryKey(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	space: text().notNull(),
	migrationName: text("migration_name").notNull(),
	migrationHash: text("migration_hash").notNull(),
	originCoreHash: text("origin_core_hash"),
	originProfileHash: text("origin_profile_hash"),
	destinationCoreHash: text("destination_core_hash").notNull(),
	destinationProfileHash: text("destination_profile_hash"),
	operations: jsonb().notNull(),
});

export const markerInPrismaContract = prismaContract.table("marker", {
	space: text().default("app").primaryKey(),
	coreHash: text("core_hash").notNull(),
	profileHash: text("profile_hash").notNull(),
	contractJson: jsonb("contract_json"),
	canonicalVersion: integer("canonical_version"),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	appTag: text("app_tag"),
	meta: jsonb().default({}).notNull(),
	invariants: text().array().default([]).notNull(),
});

export const attack = pgTable("attack", {
	attackRange: integer().notNull(),
	buffs: json(),
	camo: boolean().notNull(),
	count: integer().notNull(),
	id: serial().primaryKey(),
	name: text().notNull(),
	rate: doublePrecision().notNull(),
	statId: text().notNull().references(() => statBlock.id),
}, (table) => [
	index("attack_statId_idx_c9d8da08").using("btree", table.statId.asc().nullsLast()),
]);

export const projectile = pgTable("projectile", {
	attackId: integer().notNull().references(() => attack.id),
	bloonImmunities: integer().notNull(),
	damage: integer().notNull(),
	effects: json(),
	id: serial().primaryKey(),
	lifespan: doublePrecision().notNull(),
	modifiers: json(),
	name: text().notNull(),
	pierce: doublePrecision().notNull(),
	radius: integer().notNull(),
	speed: integer().notNull(),
}, (table) => [
	index("projectile_attackId_idx_26380785").using("btree", table.attackId.asc().nullsLast()),
]);

export const statBlock = pgTable("statBlock", {
	footprint: integer().notNull(),
	id: text().primaryKey(),
	land: boolean().notNull(),
	path1: integer().notNull(),
	path2: integer().notNull(),
	path3: integer().notNull(),
	range: integer().notNull(),
	subtowers: json(),
	towerId: text().notNull().references(() => tower.id),
	water: boolean().notNull(),
}, (table) => [
	index("statBlock_towerId_idx_201afb19").using("btree", table.towerId.asc().nullsLast()),
]);

export const tower = pgTable("tower", {
	category: text().notNull(),
	cost: integer().notNull(),
	id: text().primaryKey(),
	name: text().notNull(),
});

export const upgrade = pgTable("upgrade", {
	cost: integer().notNull(),
	id: text().primaryKey(),
	name: text().notNull(),
	path: integer().notNull(),
	tier: integer().notNull(),
	towerId: text().notNull().references(() => tower.id),
}, (table) => [
	index("upgrade_towerId_idx_201afb19").using("btree", table.towerId.asc().nullsLast()),
]);

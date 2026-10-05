-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SCHEMA "prisma_contract";
--> statement-breakpoint
CREATE TABLE "prisma_contract"."contract" (
	"core_hash" text PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"contract_json" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prisma_contract"."ledger" (
	"id" bigserial PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"space" text NOT NULL,
	"migration_name" text NOT NULL,
	"migration_hash" text NOT NULL,
	"origin_core_hash" text,
	"origin_profile_hash" text,
	"destination_core_hash" text NOT NULL,
	"destination_profile_hash" text,
	"operations" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prisma_contract"."marker" (
	"space" text PRIMARY KEY DEFAULT 'app',
	"core_hash" text NOT NULL,
	"profile_hash" text NOT NULL,
	"contract_json" jsonb,
	"canonical_version" integer,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"app_tag" text,
	"meta" jsonb DEFAULT '{}' NOT NULL,
	"invariants" text[] DEFAULT '{}'::text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attack" (
	"attackRange" integer NOT NULL,
	"buffs" json,
	"camo" boolean NOT NULL,
	"count" integer NOT NULL,
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"rate" double precision NOT NULL,
	"statId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projectile" (
	"attackId" integer NOT NULL,
	"bloonImmunities" integer NOT NULL,
	"damage" integer NOT NULL,
	"effects" json,
	"id" serial PRIMARY KEY,
	"lifespan" double precision NOT NULL,
	"modifiers" json,
	"name" text NOT NULL,
	"pierce" double precision NOT NULL,
	"radius" integer NOT NULL,
	"speed" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "statBlock" (
	"footprint" integer NOT NULL,
	"id" text PRIMARY KEY,
	"land" boolean NOT NULL,
	"path1" integer NOT NULL,
	"path2" integer NOT NULL,
	"path3" integer NOT NULL,
	"range" integer NOT NULL,
	"subtowers" json,
	"towerId" text NOT NULL,
	"water" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tower" (
	"category" text NOT NULL,
	"cost" integer NOT NULL,
	"id" text PRIMARY KEY,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "upgrade" (
	"cost" integer NOT NULL,
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"path" integer NOT NULL,
	"tier" integer NOT NULL,
	"towerId" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "attack_statId_idx_c9d8da08" ON "attack" ("statId");--> statement-breakpoint
CREATE INDEX "projectile_attackId_idx_26380785" ON "projectile" ("attackId");--> statement-breakpoint
CREATE INDEX "statBlock_towerId_idx_201afb19" ON "statBlock" ("towerId");--> statement-breakpoint
CREATE INDEX "upgrade_towerId_idx_201afb19" ON "upgrade" ("towerId");--> statement-breakpoint
ALTER TABLE "attack" ADD CONSTRAINT "attack_statId_fkey" FOREIGN KEY ("statId") REFERENCES "statBlock"("id");--> statement-breakpoint
ALTER TABLE "projectile" ADD CONSTRAINT "projectile_attackId_fkey" FOREIGN KEY ("attackId") REFERENCES "attack"("id");--> statement-breakpoint
ALTER TABLE "statBlock" ADD CONSTRAINT "statBlock_towerId_fkey" FOREIGN KEY ("towerId") REFERENCES "tower"("id");--> statement-breakpoint
ALTER TABLE "upgrade" ADD CONSTRAINT "upgrade_towerId_fkey" FOREIGN KEY ("towerId") REFERENCES "tower"("id");
*/
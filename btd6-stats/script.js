import { db } from "./src/prisma/db.ts";
import * as cheerio from "cheerio";

import upgrades from "./btd6_upgrades.json" with { type: "json" };
import towers from "./btd6_towers.json" with { type: "json" };

// function createAllTowers()
// parameters: a json file of towers
// create a database record for the tower
// create a related record for each of its stats, based on all crosspaths
// returns an array of tower ids that had records created
async function createAllTowers(towers) {
  let arr = [];
  for (let i = 0; i < towers.length; i++) {
    const id = towers[i]["name"].replace(" ", "_");
    const problemTowers = [
      "Monkey_Academy",
      "Banana_Farm",
      "Skywarden",
      "Monkey_Village",
    ];
    if (problemTowers.includes(id)) {
      continue;
    }
    await db.orm.public.tower.create({
      name: towers[i]["name"],
      category: towers[i]["category"],
      cost: towers[i]["cost"],
      id,
    });
    createStatBlocks(id); // finds and populates stats for every crosspath
    arr.push(id);
  }
  return arr;
}

// function queryTowerData()
// for a given tower id, finds the stats for all paths via Blooncyclopedia
// returns a cheerio object
async function queryTowerData(towerId) {
  const url =
    "https://www.bloonswiki.com/Module:BTD6_stats/" + towerId + "/new";
  const response = await fetch(url);

  const $ = cheerio.load(await response.text());
  const $table = $("table.mw-json").first();
  return $table;
}

// function parseTable()
// helper function to parse the Cheerio obj holding the table from the web
// iterates through the table rows, recursively entering nested objects
// returns an object with every
function parseTable($table) {
  const obj = {};

  const $rows = $table.children("tbody").first().children("tr");

  let currRow = $rows.first();
  let i = 0;
  while (currRow.next() && i < $rows.length) {
    i++;
    const head = currRow.children("th").first().text();
    const body = currRow.children("td").first();
    const bodyContents = body.children().first();
    const finalValue = bodyContents.prop("tagName")
      ? parseTable(bodyContents)
      : body.contents().text();

    obj[head] = finalValue;
    currRow = currRow.next();
  }
  return obj;
}

// function createStatBlocks()
// given a tower's id
// creates statBlock record for each crosspath combination
// uses helper functions to create the linked attacks and projectiles
// TODO: clean this up?
async function createStatBlocks(towerId) {
  const $table = await queryTowerData(towerId);
  const data = parseTable($table);
  let path = 1,
    tier = 0;
  let existingPaths = [];
  while (path <= 3) {
    let baseId = "_000";
    let pathId = baseId.slice(0, path) + tier + baseId.slice(path + 1);
    let stats = { ...data[pathId], id: pathId };

    if (!existingPaths.includes(pathId)) {
      await db.orm.public.statBlock.create({
        towerId: towerId,
        id: towerId + pathId,
        path1: Number(pathId[1]),
        path2: Number(pathId[2]),
        path3: Number(pathId[3]),
        land: stats["placeableOnLand"] == "true",
        water: stats["placeableOnWater"] == "true",
        range: Number(stats["range"]),
        footprint:
          Number(stats["footprintRadius"]) || Number(stats["footprintX"]),
      });
      if (stats.attacks) {
        await createAttacks(stats.attacks, towerId + pathId);
      }
    }
    existingPaths.push(pathId);

    // all potential crosspaths
    let crosspath = pathId.indexOf("0");
    while (crosspath > 0 && tier > 0) {
      let crosspathExists = true;
      let clone = structuredClone(stats);
      let secondTier = 1;
      while (crosspathExists) {
        // plug the crosspath tier into the two zero values of pathId one at a time
        let crosspathId =
          pathId.slice(0, crosspath) + secondTier + pathId.slice(crosspath + 1);
        if (!existingPaths.includes(crosspathId)) {
          // we need to merge clone where newStats overwrites potential properties
          // for each property in override
          // update clone to have that
          let overrideStats = data[pathId][crosspathId];
          let newStats = structuredClone(overrideStats);
          let crosspathStats = replaceAttrs(clone, newStats);
          await db.orm.public.statBlock.create({
            towerId,
            id: towerId + crosspathId,
            path1: Number(crosspathId[1]),
            path2: Number(crosspathId[2]),
            path3: Number(crosspathId[3]),
            land: crosspathStats["placeableOnLand"] == "true",
            water: crosspathStats["placeableOnWater"] == "true",
            range: Number(crosspathStats["range"]),
            footprint:
              Number(crosspathStats["footprintRadius"]) ||
              Number(crosspathStats["footprintX"]),
          });
          if (crosspathStats.attacks) {
            await createAttacks(crosspathStats.attacks, towerId + crosspathId);
          }
          // could save crosspaths to avoid dupes
          existingPaths.push(crosspathId);
          if (tier > 1 && secondTier === 1) {
            // do it again, where secondtier is 2,
            // //and clone is crosspathStats instead of stats
            secondTier = 2;
            clone = crosspathStats;
          } else {
            crosspathExists = false;
          }
        } else {
          crosspathExists = false;
        }
      }
      crosspath = pathId.indexOf("0", crosspath + 1);
    }
    // increment the tier / path
    tier++;
    if (tier > 5) {
      tier = 1;
      path++;
    }
  }
}

// function replaceAttrs()
// a utility function to satisfactorily merge two objects s.t. :
// returns the combined object
function replaceAttrs(defaultObj, newObj) {
  let obj = { ...defaultObj };
  if (!newObj) {
    return obj;
  }
  if (!defaultObj) {
    obj = { ...newObj };
    return obj;
  }

  for (let property of Object.keys(newObj)) {
    let propType = typeof newObj[property];
    if (propType == "object") {
      obj[property] = replaceAttrs(defaultObj[property], newObj[property]);
    } else {
      obj[property] = newObj[property];
    }
  }
  return obj;
}

// function createAttacks()
// given a list of projectiles that belong to a single stat id,
// creates a db record for each attack
async function createAttacks(attacks, statId) {
  // create an attack for each in attacks not named order
  for (let attack in attacks) {
    if (attack == "_order") {
      continue;
    }
    let obj = attacks[attack];
    const attackId = await db.orm.public.attack.create({
      name: attack,
      rate: Number(obj.rate),
      count: Number(obj.count) || 0,
      attackRange: Number(obj.range) || 0,
      statId,
      camo: obj.filterInvisible == "false",
      buffs: obj.buffs,
    });
    // TODO: how to store misc modifiers, effects of the attack?
    await createProjectiles(obj.projectiles, Number(attackId.id));
  }
}

// function createProjectiles()
// given a list of projectiles that belong to a single attack id,
// creates a db record for each projectile
async function createProjectiles(projectiles, attackId) {
  // create a projectile for each in projectiles not named order
  for (let proj in projectiles) {
    if (proj == "_order") {
      continue;
    }
    let obj = projectiles[proj];
    let modifiers = {};
    if (obj?.damageModifierForCeramic) {
      modifiers.ceramic = obj?.damageModifierForCeramic;
    }
    if (obj?.damageModifierForMoabs) {
      modifiers.moab = obj?.damageModifierForMoabs;
    }
    if (obj?.damageModifierForCeramicOrMoabs) {
      modifiers.ceramic = obj?.damageModifierForCeramicOrMoabs;
      modifiers.moab = obj?.damageModifierForCeramicOrMoabs;
    }
    if (obj?.damageModifierForFortified) {
      modifiers.fortified = obj?.damageModifierForFortified;
    }
    if (obj?.damageModifierForLeadOrDdt) {
      modifiers.lead = obj?.damageModifierForLeadOrDdt;
    }
    await db.orm.public.projectile.create({
      name: proj,
      pierce: Number(obj.pierce) || 0,
      damage: Number(obj.damage) || 0,
      radius: Number(obj.radius) || 0,
      bloonImmunities: Number(obj.immuneBloonProperties) || 0,
      speed: Number(obj.speed) || 0,
      lifespan: Number(obj.lifespan) || 0,
      effects: obj.effects,
      modifiers,
      attackId,
    });
  }
}

// function createAllUpgrades()
// parameters: array of tower ids, json file of upgrade data
// for each tower id, finds all upgrades associated with that tower
// creates a db record for each upgrade
async function createAllUpgrades(towerNames, upgrades) {
  for (let i = 0; i < upgrades.length; i++) {
    const towerId = upgrades[i]["tower"].replace(" ", "_");
    if (towerNames.includes(towerId)) {
      await db.orm.public.upgrade.create({
        id: String(i),
        name: upgrades[i]["name"],
        cost: upgrades[i]["cost"],
        path: upgrades[i]["path"],
        tier: upgrades[i]["tier"],
        towerId,
      });
    }
  }
}

// function clearAllTables()
// completely wipes data from all tables
// important to makes sure db is clean before populating
async function clearAllTables() {
  await db.orm.public.upgrade.where({}).deleteAll();
  await db.orm.public.projectile.where({}).deleteAll();
  await db.orm.public.attack.where({}).deleteAll();
  await db.orm.public.statBlock.where({}).deleteAll();
  await db.orm.public.tower.where({}).deleteAll();
}

async function main() {
  await clearAllTables();
  const towerIds = await createAllTowers(towers);
  await createAllUpgrades(towerIds, upgrades);

  // const created = await db.orm.public.tower.create({
  //   id: "Dart_Monkey",
  //   name: "Dart Monkey",
  //   category: "Primary",
  //   cost: 200,
  // });
  // console.log("Created:", created);

  // const users = await db.orm.public.tower.all();
  // console.log("All tower:", users);

  await db.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

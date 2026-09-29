import * as cheerio from "cheerio";
import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

import towers from "./html-pages/btd6_towers.json" with { type: "json" };
import upgrades from "./html-pages/btd6_upgrades.json" with { type: "json" };

// in the frontend, we make a request for the tower and its pathing

// 1-to-many TOWER:STATS
// 1-to-many TOWER:UPGRADES

// gets the upgrade data for a single tower
// since each tower is on a separate page, we make HTTP request to the website
async function getTowerData(towerId) {
  // use paramaters
  const url =
    "https://www.bloonswiki.com/Module:BTD6_stats/" + towerId + "/new";
  const response = await fetch(url);

  const $ = cheerio.load(await response.text());
  const $table = $("table.mw-json").first();
  // console.log($table.text());
  function parseData(table) {
    const obj = {};

    const $rows = table.children("tbody").first().children("tr");

    let currRow = $rows.first();
    let i = 0;
    while (currRow.next() && i < $rows.length) {
      i++;
      const head = currRow.children("th").first().text();
      const body = currRow.children("td").first();
      // all children, not just first...?
      const bodyContents = body.children().first();
      const finalValue = bodyContents.prop("tagName")
        ? parseData(bodyContents)
        : body.contents().text();

      obj[head] = finalValue;
      currRow = currRow.next();
    }
    return obj;
  }
  const data = parseData($table);
  // for each object

  let path = 1,
    tier = 0;
  let existingPaths = [];
  while (path <= 3) {
    let baseId = "_000";
    let pathId = baseId.slice(0, path) + tier + baseId.slice(path + 1);
    let stats = { ...data[pathId], id: pathId };

    if (!existingPaths.includes(pathId)) {
      await prisma.statBlock.create({
        data: {
          tower: { connect: { id: towerId } },
          id: towerId + pathId,
          path1: Number(pathId[1]),
          path2: Number(pathId[2]),
          path3: Number(pathId[3]),
          land: stats["placeableOnLand"] == "true",
          water: stats["placeableOnWater"] == "true",
          range: Number(stats["range"]),
          footprint:
            Number(stats["footprintRadius"]) || Number(stats["footprintX"]),
        },
      });
      if (stats.attacks) {
        await createAttacks(stats.attacks, towerId + pathId);
      }
    }
    // we can link by the tower id we passed in
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

          let flag = false;
          if (towerId + crosspathId == "Dart_Monkey_022") {
            flag = true;
          }
          let crosspathStats = replaceAttr(clone, newStats, flag);
          await prisma.statBlock.create({
            data: {
              tower: { connect: { id: towerId } },
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
            },
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

function replaceAttr(defaultObj, newObj, debugFlag = false) {
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
    if (debugFlag) {
      console.log(property);
      console.log(propType);
    }
    if (propType == "object") {
      obj[property] = replaceAttr(
        defaultObj[property],
        newObj[property],
        debugFlag,
      );
    } else {
      obj[property] = newObj[property];
    }
  }
  return obj;
}

async function createAttacks(attacks, statId) {
  // create an attack for each in attacks not named order
  for (let attack in attacks) {
    if (attack == "_order") {
      continue;
    }
    let obj = attacks[attack];
    const attackId = await prisma.attack.create({
      data: {
        name: attack,
        rate: Number(obj.rate),
        count: Number(obj.count) || 0,
        attackRange: Number(obj.range) || 0,
        statsFor: { connect: { id: statId } },
        camo: obj.filterInvisible == "false",
        buffs: obj.buffs,
      },
    });
    // TODO: what if there are no projectiles... do we even make an attack?
    // probably yes
    // TODO: misc modifiers: crit,  etc.
    // TODO: effects...
    await createProjectiles(obj.projectiles, Number(attackId.id));
  }
}

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
    /* */
    await prisma.projectile.create({
      data: {
        name: proj,
        pierce: Number(obj.pierce) || 0,
        damage: Number(obj.damage) || 0,
        radius: Number(obj.radius) || 0,
        bloonImmunities: Number(obj.immuneBloonProperties) || 0,
        speed: Number(obj.speed) || 0,
        lifespan: Number(obj.lifespan) || 0,
        effects: obj.effects,
        modifiers,
        attack: { connect: { id: attackId } },
      },
    });
    /**/
  }
}

// tower cargo table: https://www.bloonswiki.com/Special:CargoTables/btd6_towers
// {name, image, category, cost}
async function getAllTowers() {
  let arr = [];
  // for each tower: get upgrade data (from upgrades?) and stats (from getTowerData())
  for (let i = 0; i < towers.length; i++) {
    // parse the name
    const id = towers[i]["name"].replace(" ", "_");
    const problemTowers = [
      "Monkey_Academy",
      "Banana_Farm",
      "Skywarden", // still a problem?
      "Monkey_Village",
    ];
    if (problemTowers.includes(id)) {
      continue;
    }
    await prisma.tower.create({
      data: {
        name: towers[i]["name"],
        category: towers[i]["category"],
        cost: towers[i]["cost"],
        id,
      },
    });
    getTowerData(id); // finds stats for every crosspath
    arr.push(id);
  }
  return arr;
}

// upgrade cargo table: https://www.bloonswiki.com/Special:CargoTables/btd6_upgrades
// {name, icon, image, description, tower, path, tier, cost}
/* https://www.bloonswiki.com/index.php?title=Special:CargoQuery&limit=500&tables=btd6_upgrades&
fields=%2Cname%3Dname%2Cicon%3Dicon%2Cimage%3Dimage%2Cdescription%3Ddescription
%2Ctower%3Dtower%2Cpath%3Dpath%2Ctier%3Dtier%2Ccost%3Dcost
*/

async function getAllUpgrades(towerNames) {
  for (let i = 0; i < upgrades.length; i++) {
    // match the tower
    // name, cost, path, tier
    const towerId = upgrades[i]["tower"].replace(" ", "_");
    // console.log();
    if (towerNames.includes(towerId)) {
      await prisma.upgrade.create({
        data: {
          id: String(i),
          name: upgrades[i]["name"],
          cost: upgrades[i]["cost"],
          path: upgrades[i]["path"],
          tier: upgrades[i]["tier"],
          description: "Description empty.",
          tower: { connect: { id: towerId } },
        },
      });
    }
  }
}

async function getImages() {}

async function clearAllTables() {
  await prisma.upgrade.deleteMany();
  await prisma.projectile.deleteMany();
  await prisma.attack.deleteMany();
  await prisma.statBlock.deleteMany();
  await prisma.tower.deleteMany();
}

async function setup() {
  // make sure table is clean before acting
  await clearAllTables();
  // populate tables
  let towerIds = await getAllTowers();
  // first table: basic Tower info
  // second table: stat blocks, attacks, projectiles
  // third table: upgrades
  await getAllUpgrades(towerIds);
}
setup();
// clearAllTables();

// once we scrape everything we need to put it in a database
// store images locally i suppose - Cloudflare, Cloudinary

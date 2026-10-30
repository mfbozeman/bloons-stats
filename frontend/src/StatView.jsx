import { useEffect, useState } from "react";
import Projectile from "./Projectile";
import styles from "./styles/StatView.module.css";
import { importTowers, importPortraits } from "./utils";

// doesn't it make more sense to have the attack logic here?
// then projectiles are a problem... so toggle projectiles
// fetch upgrade related info in here? (title, cumul cost) - pass upgrades

// new props: block id, upgrades(active or all), category, costMult
// need to get tower info via the fetch: upgrades, base cost - backend work

// associate an attack with its proj

const portraits = importTowers();
const upgradePortraits = importPortraits();

function StatView(props) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [projIndex, setProjIndex] = useState(0);

  useEffect(() => {
    const url = "https://btd6-stats.onrender.com/stats/" + props.id;
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        setStats(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // alternate views come up if :
  // projectile only has effects: special proj view
  // projectile has no damage or effects: shouldn't be included
  // attack has no valid projectiles:
  //    buff: special attack view
  //    subtower: special subtower view
  //    other: shouldn't be included
  if (!stats || loading) {
    return (
      <>
        <div className={styles["stat-card"]}>
          <h2>updating...</h2>
        </div>
      </>
    );
  }

  // statBlock gives us access to the path nums
  const name = props.id.slice(0, -3).replaceAll("_", " ").trim();
  const condense = name.replaceAll(" ", "");

  const path = [stats.path1, stats.path2, stats.path3];
  const tier = path.reduce((a, b) =>
    Math.max(parseInt(a), parseInt(b), -Infinity),
  );
  const mainPath = path.indexOf(tier);
  const singlePathNums = path.map((e, i) => (i === mainPath ? e : 0));

  // dealing with upgrades
  const upgradeList = props?.upgrades
    ? props.upgrades
        .filter((a) => {
          return a.path > 0;
        })
        .toSorted((a, b) => {
          return a.path - b.path === 0 ? a.tier - b.tier : a.path - b.path;
        })
    : [];
  // sorted so a given upgrade is at path*5 + tier - 1
  // title = tower name if 000 else upgrade name

  const title =
    tier === 0 || upgradeList.length < 1
      ? name
      : upgradeList[mainPath * 5 + tier - 1]?.name;

  // need to adjust for diff multiplier
  function getCost() {
    let sum = 0; // base cost?
    for (let i = 0; i < 3; i++) {
      for (let j = 1; j <= path[i]; j++) {
        sum += upgradeList[i * 5 + j - 1]?.cost;
      }
    }
    return sum;
  }

  const portraitUrl =
    tier === 0
      ? portraits["./assets/towers/180px-BTD6_000-" + condense + "_zZLs.png"]
      : upgradePortraits[
          "./assets/portraits/180px-BTD6_" +
            singlePathNums.join("") +
            "-" +
            condense +
            "_X5-a.png"
        ];

  // if an attack has no projectiles, it is either a buff or spawner
  const allProjectiles = stats.attacks.reduce((acc, curr, index) => {
    return acc.concat(
      curr.projectiles.map((p) => {
        return { ...p, attackIndex: index };
      }),
    ); // map extra info to the projectiles
  }, []);

  const projectileMenu = allProjectiles.map((p, i) => {
    console.log(p);
    return (
      <>
        <div
          onClick={() => {
            setProjIndex(i);
          }}
          className={i === projIndex ? styles.active : null}
        >
          {i + 1}
        </div>
      </>
    );
  });

  // call both attack and projectile here
  const currProj = allProjectiles[projIndex];
  const projView = (
    <Projectile
      proj={currProj}
      cost={props.cost}
      camo={stats.attacks[currProj.attackIndex].camo}
      rate={stats.attacks[currProj.attackIndex].rate}
      range={stats.attacks[currProj.attackIndex].attackRange}
    />
  );

  // attack, proj, land, info
  return (
    <>
      <div className={styles["stat-card"]}>
        <div className={styles["info"]}>
          <div>
            <img src={portraitUrl} alt="" className={styles["portrait"]} />
            <h2>{title}</h2>
            <p>
              {path.join("-") + " " + name}, {props.category}
            </p>
          </div>
          {/* {getCost()} */}
          {/* Land: {props.block.land ? "yes" : "no"} Water: {props.block.water ? "yes" : "no"} */}
        </div>
        <div className={styles["proj"]}>{projView}</div>

        {projectileMenu.length <= 1 ? null : (
          <>
            <p>attacks</p>
            <div className={styles.bar}>{projectileMenu}</div>
          </>
        )}
      </div>
    </>
  );
}

export default StatView;

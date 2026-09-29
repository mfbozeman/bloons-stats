import Upgrade from "./Upgrade";
import StatView from "./StatView";
import { useEffect, useState } from "react";
import { useParams, data } from "react-router";

import { importTowers, importPortraits } from "./images";
import chevronDown from "./assets/chevron-down.svg";
import chevronUp from "./assets/chevron-up.svg";
import styles from "./styles/Tower.module.css";

// a component for a single Tower, containing data on all of its paths
// e.g. a Dart Monkey

// portrait-style stat cards
// TODO: loading page

const portraits = importTowers();
const upgradePortraits = importPortraits();

function Tower() {
  // this is an object of each path's data
  const { towerId } = useParams();

  // states ?
  const [path, setPath] = useState([0, 0, 0]);
  const [info, setInfo] = useState(null);
  // loading and error.
  const [loading, setLoading] = useState(false); // loaders?
  const [error, setError] = useState(false);

  // split these off?
  const [costMult, setCostMult] = useState(1);
  const [menu, setMenu] = useState("closed");

  // ...?
  const [attackIndex, setAttackIndex] = useState(0);
  const [projIndex, setProjIndex] = useState(0);

  const tier = Math.max(...path);
  const mainPath = path.indexOf(tier); //0-indexed, so +1 when displaying

  const portraitUrl =
    tier === 0
      ? portraits[
          "./assets/towers/180px-BTD6_000-" +
            towerId.replace("_", "") +
            "_zZLs.png"
        ]
      : upgradePortraits[
          "./assets/portraits/180px-BTD6_" +
            path.reduce((accum, curr, index) => {
              return index === mainPath ? accum + curr : accum + "0";
            }, "") +
            "-" +
            towerId.replace("_", "") +
            "_X5-a.png"
        ];

  // easy mult = 0.85
  // hard mult = 1.08
  // impoppable = 1.2

  function getCost(num) {
    // round to nearest 5
    return Math.round((num * costMult - 0.01) / 5) * 5;
  }

  useEffect(() => {
    const url = "http://localhost:3000/tower/" + towerId;
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        // throw if response bad

        console.log(response);
        setInfo(response);
      })
      .catch((err) => {
        setError({ status: "404", body: "Not Found" });
      });

    // url
  }, [towerId]);
  if (error) {
    throw data("Tower Not Found", { status: "404" });
  }

  function updatePath(newVal, atIndex) {
    const newArr = path.map((x, i) => {
      if (i === atIndex) {
        return Number(newVal);
      } else {
        return x;
      }
    });
    setPath(newArr);
  }

  const category = info ? info.category : null;
  const desired_id = towerId + "_" + path.join("");
  let attacks = [];

  const upgradeList = info?.upgrades
    ? info.upgrades
        .filter((a) => {
          return a.path > 0;
        })
        .toSorted((a, b) => {
          return a.path - b.path === 0 ? a.tier - b.tier : a.path - b.path;
        })
    : [];
  let cumulCost = getCost(info?.cost);
  const upgradeChart = upgradeList?.slice(0, 15).map((u) => {
    let active = false;
    let canBeActive = true;
    if (path[u.path - 1] >= u.tier) {
      active = true;
      cumulCost += getCost(u.cost);
    } else if (
      (path[u.path % 3] > 0 && path[(u.path + 1) % 3]) ||
      (tier > 2 && u.tier > 2 && u.path - 1 !== mainPath)
    ) {
      canBeActive = false;
    }
    return (
      <Upgrade
        onClick={() => {
          clickUpgrade(u.path, u.tier);
        }}
        id={u.id}
        key={u.key}
        path={u.path}
        tier={u.tier}
        name={u.name}
        cost={getCost(u.cost)}
        active={active}
        enabled={canBeActive}
        towerId={towerId}
      />
    );
  });

  function clickUpgrade(p, t) {
    setAttackIndex(0);
    setProjIndex(0);
    if (path[p - 1] === t) {
      updatePath(0, p - 1);
    } else if (mainPath !== p - 1) {
      if ((path[p % 3] > 0 && path[(p + 1) % 3]) || (tier > 2 && t > 2)) {
        return;
      } else {
        updatePath(t, p - 1);
      }
    } else {
      updatePath(t, p - 1);
    }
  }

  const currUpgrade =
    tier > 0
      ? upgradeList[5 * mainPath + tier - 1]
      : { name: "Base", cost: info?.cost, cumulCost: info?.cost };

  // TODO: clean this up.. rn StatView relies too much on Tower
  // we use: proj, attack, cost, genInfo
  // instead of info, pass in "portraitUrl", the name to be used, towerName, path, category
  // curr.id has towerName and path
  // mov image logic, pass in upgrade name, and category
  // can any of this be grouped into an object?
  const stats = info?.stats
    ? info.stats.reduce((acc, curr) => {
        if (curr.id == desired_id) {
          attacks = curr.attacks;
          return (
            <StatView
              block={curr}
              key={curr.id}
              attack={curr.attacks[attackIndex]}
              proj={curr.attacks[attackIndex]?.projectiles[projIndex]}
              cost={cumulCost}
              title={tier === 0 ? info?.name : currUpgrade?.name}
              category={category}
              portrait={portraitUrl}
            />
          );
        }
        return acc;
      }, null)
    : null;
  // if there's only one proj, don't bother
  // what if only one attack? and it has 1/2+ projs
  const attackView = attacks.map((a, i) => {
    const damageProjs = a?.projectiles?.filter((p) => {
      return p.damage > 0;
    });
    return damageProjs.length > 0 ? (
      <>
        <li>
          {i === attackIndex ? (
            <>
              {damageProjs.length > 0 ? (
                <>
                  <div
                    className={
                      attackIndex === i
                        ? styles["selected"]
                        : styles["unselected"]
                    }
                    onClick={() => {
                      setAttackIndex(i);
                      setProjIndex(0);
                    }}
                  >
                    {a.name}
                  </div>
                  <ul>
                    {damageProjs.map((p, j) => {
                      return (
                        <li
                          onClick={() => {
                            setProjIndex(j);
                          }}
                          className={
                            projIndex === j
                              ? styles["selected"]
                              : styles["unselected"]
                          }
                        >
                          {p.name}
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : null}
            </>
          ) : (
            <>
              <div
                onClick={() => {
                  setAttackIndex(i);
                  setProjIndex(0);
                }}
              >
                {a.name}
                <img src={chevronDown} alt="" />
              </div>
            </>
          )}
        </li>
      </>
    ) : null;
  });

  return (
    <>
      <div className={styles["display"]}>
        <div className={styles["stat-card"]}>{stats}</div>

        <div className={styles["upgrade-view"]}>
          <div className={styles["all-upgrades"]}>{upgradeChart}</div>
        </div>
      </div>
      <div className={styles["options"]}>
        <div>
          <h4
            onClick={() => {
              if (menu === "attacks") {
                setMenu("closed");
              } else {
                setMenu("attacks");
              }
            }}
          >
            Attacks
            <img src={menu === "attacks" ? chevronUp : chevronDown} alt="" />
          </h4>
          {menu === "attacks" ? <ul>{attackView}</ul> : null}
        </div>
        <div>
          <h4
            onClick={() => {
              if (menu === "options") {
                setMenu("closed");
              } else {
                setMenu("options");
              }
            }}
          >
            More options
            <img src={menu === "options" ? chevronUp : chevronDown} alt="" />
          </h4>
          {menu === "options" ? (
            <div className={styles["more-options"]}>
              {/* <form action="" className={styles["buffs"]} onChange={() => {}}>
                <label htmlFor="drums">Jungle Drums:</label>
                <input type="checkbox" id="drums" name="drums" />
              </form> */}
              <form>
                <label htmlFor="difficulty">Difficulty: </label>
                <select
                  name="difficulty"
                  id="difficulty"
                  defaultValue={costMult}
                  onChange={(e) => setCostMult(e.target.value)}
                >
                  <option value="0.85">Easy</option>
                  <option value="1">Medium</option>
                  <option value="1.08">Hard</option>
                  <option value="1.2">Impoppable</option>
                </select>
              </form>
              More coming soon!
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

// options menu
//              (<p>View toggler - portrait v landscape</p>
//               <p>Attack Speed vs Attack cooldown toggle</p>
//               <p>
//                 include common buffs:
//                 <label htmlFor="">Jungle Drums</label>
//                 <input type="checkbox" name="" id="" />
//                 {/* 85% cooldown */}
//                 <label htmlFor="">Berserker Brew</label>
//                 <input type="checkbox" name="" id="" />
//                 {/* 110% range, 90% cooldown, +1 damage, +2 pierce */}
//                 <label htmlFor="">Stronger Stim</label>
//                 <input type="checkbox" name="" id="" />
//                 {/* 115% range, 85% cooldown, +1 damage, +3 pierce, mutually Ex with brew */}
//               </p>
//               <p>DPS Calculation:</p>
//               <p>Show DPS checkbox</p>
//               <p>Calculate DPS by Max damage/Ceramic/MOAB</p>
//               {/* max is theoretical max, ceramic is capped at 128, moab is moab only */}
//               <p>Normalize by range ?</p>)

// option to form
/* <form>
    <input
      type="number"
      name="path1"
      id="path1"
      value={path[0]}
      min={0}
      max={
        Math.max(path[1], path[2]) <= 2
          ? 5
          : Math.min(path[1], path[2]) > 0
            ? 0
            : 2
      }
      onChange={(e) => updatePath(e.target.value, 0)}
    />
  </form> */

{
  /* <div className={styles["clear-upgrades"]}>
          <img
            src={close}
            alt="Clear Path"
            onClick={() => {
              clearPath(0);
            }}
          />
          <img
            src={close}
            alt="Clear Path"
            onClick={() => {
              clearPath(1);
            }}
          />
          <img
            src={close}
            alt="Clear Path"
            onClick={() => {
              clearPath(2);
            }}
          />
        </div> */
}

export default Tower;

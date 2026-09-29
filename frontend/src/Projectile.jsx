import { useState } from "react";
import noBloon from "./assets/No_bloon.svg";
import yesBloon from "./assets/Yes_bloon.svg";
import chevronDown from "./assets/chevron-down.svg";
import chevronUp from "./assets/chevron-up.svg";
import { importBloons } from "./images";

import styles from "./styles/Projectile.module.css";

// import images from "./images";
const images = importBloons();
const bloonTypes = [
  "Frozen",
  "Black",
  "White",
  "Purple",
  "Lead",
  "Camo",
  "DDT",
];

function Projectile(props) {
  const [showCoverage, setCoverage] = useState(false);
  // a projectile is not always damaging:
  // e.g. bomb shooter's explosion, or base glue gunner's proj
  // TODO: exclude NON-damaging projectiles like explosions etc
  if (props.proj.damage <= 0) {
    return (
      <div>
        <h2>This projectile is currently unsupported.</h2>
      </div>
    );
  }

  const bloonImages = bloonTypes.map((str) => {
    let bloonUrl = "./assets/bloons/BTD6_bloon_" + str + ".png";

    return (
      <th>
        <img src={images[bloonUrl]} alt={str} />
      </th>
    );
  });

  const damageTypes = {
    0: "Normal",
    1: "Shatter",
    2: "Explosion",
    4: "Glacier",
    5: "Cold",
    8: "Fire",
    12: "Frigid",
    17: "Sharp",
    64: "Acid",
    72: "Plasma",
    73: "Energy",
  };
  const popsFrozen = (props.proj.bloonImmunities & 16) === 0;
  const popsPurple = (props.proj.bloonImmunities & 8) === 0;
  const popsWhite = (props.proj.bloonImmunities & 4) === 0;
  const popsBlack = (props.proj.bloonImmunities & 2) === 0;
  const popsLead = (props.proj.bloonImmunities & 1) === 0;
  const popsDDT = popsBlack && popsLead && props.camo;
  const type = damageTypes[props.proj.bloonImmunities];

  const bloonImmunities = [
    popsFrozen,
    popsBlack,
    popsWhite,
    popsPurple,
    popsLead,
    props.camo,
    popsDDT,
  ];
  const bloonChart = bloonImmunities.map((pops) => {
    return pops ? (
      <td>
        <img src={yesBloon} alt="Yes" />
      </td>
    ) : (
      <td>
        <img src={noBloon} alt="No" />
      </td>
    );
  });

  let miscInfo = [];
  const damageMods = props.proj.modifiers;
  const modifierList = Object.keys(props.proj.modifiers);
  const effects = props.proj.effects ? props.proj?.effects["_order"][""] : [];

  // TODO: we might want to save these numbers somewhere...
  // TODO: abilities and effects

  // const bonusDamage = [0,0,0,0]; // lead, ceramic, moab, fort
  for (let i = 0; i < modifierList.length; i++) {
    miscInfo.push(
      <p className={styles[modifierList[i]]}>
        {modifierList[i]} damage:{" "}
        {Number(props.proj.damage) + Number(damageMods[modifierList[i]])}
      </p>,
    );
  }

  // for (let e in effects) {
  //   let obj = props.proj.effects[effects[e]];
  //   // TODO: how to render an effect?
  //   // they'll all be named in _order
  //   miscInfo.push(<>{effects[e]},</>);
  // }

  // possible effects and modifiers are:
  // modifiers: fortified, ceramic, moab, lead
  // there may be more we're not listening for
  // effects: _order (names in here), damage over time, Knockback, Stun, Radiation, Blowback, ...
  // Freeze, Glue, Maim MOAB, Laser Shock, Mark, ... more etc

  // damage image
  //RBGYP = 1-5, B/W/Purp 11, Zebra/Lead 23, Rainbow 47, Super/Ceramic/Fort = 68/104/128, MOAB/Fort = 616/856
  let damageUrl = "./assets/bloons/BTD6_bloon_";
  switch (true) {
    case props.proj.damage >= 616:
      damageUrl += "MoabIcon.png";
      break;
    case props.proj.damage >= 104:
      damageUrl += "Ceramic.png";
      break;
    case props.proj.damage >= 68:
      damageUrl += "Ceramic.png";
      // Asterisk: superceramics only
      break;
    case props.proj.damage >= 47:
      damageUrl += "Rainbow.png";
      break;
    case props.proj.damage >= 23:
      damageUrl += "Lead.png";
      break;
    case props.proj.damage >= 11:
      damageUrl += "Black.png";
      break;
    case props.proj.damage >= 5:
      damageUrl += "Pink.png";
      break;
    case props.proj.damage >= 4:
      damageUrl += "Yellow.png";
      break;
    case props.proj.damage >= 3:
      damageUrl += "Green.png";
      break;
    case props.proj.damage >= 2:
      damageUrl += "Blue.png";
      break;
    default:
      damageUrl += "Red.png";
      break;
  }

  return (
    <>
      <div className={styles["projectile"]}>
        <div className={styles["stats"]}>
          <p className={styles["cost"]}>${props.cost}</p>
          <p className={styles["range"]}>
            {/* Range:  */}
            {props.range < 1000 ? props.range : <>&#8734;</>} units
          </p>
          <p className={styles["speed"]}>
            {/* Cooldown:  */}
            {props.rate.toFixed(2)}sec
          </p>
          <p className={styles["damage"]}>
            {props.proj.damage} damage
            <img src={images[damageUrl]} alt="" />
            <ul>{modifierList.length > 0 ? <>{miscInfo}</> : null}</ul>
          </p>
          <p className={styles["pierce"]}>{props.proj.pierce} pierce</p>
        </div>
        <div className={styles["dps"]}>
          <h4>DPS</h4>
          <p>Single target: {(props.proj.damage / props.rate).toFixed(2)}</p>
          <p>
            Spread:{" "}
            {((props.proj.damage * props.proj.pierce) / props.rate).toFixed(2)}
          </p>
        </div>
        {/* mods and effects */}
        <div className={styles["coverage"]}>
          <h4
            onClick={() => {
              setCoverage(!showCoverage);
            }}
          >
            {type} damage{" "}
            {showCoverage ? (
              <img src={chevronUp} alt="" />
            ) : (
              <img src={chevronDown} alt="" />
            )}
          </h4>
          {showCoverage ? (
            <table>
              <thead>
                <tr>{bloonImages}</tr>
              </thead>
              <tbody>
                <tr>{bloonChart}</tr>
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Projectile;

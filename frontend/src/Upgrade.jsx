// displays as a box with the upgrade image (name and cost?)
// when clicked should bring up the statview OR set crosspath

import { importUpgrades } from "./images";
import styles from "./styles/Upgrade.module.css";

// TODO: upgrade image naming is inconsistent :|

const images = importUpgrades();

function Upgrade(props) {
  // upgrade image url src
  let imgUrl =
    "./assets/upgrades/upgrade-icons/180px-BTD6_" +
    props.towerId.replace("_", "") +
    "_" +
    props.name.replaceAll(" ", "").replace("&#039;", "").replace(":", "") +
    "UpgradeIcon_X5-a.png";

  return (
    <div>
      <div
        className={
          props.active
            ? styles["upgrade-active"]
            : props.enabled
              ? styles["upgrade-inactive"]
              : styles["upgrade-invalid"]
        }
        onClick={props.onClick}
      >
        <img src={images[imgUrl]} alt="" />
      </div>
      {/* <h3>{props.name}</h3>
      <h4>{props.cost}</h4> */}
    </div>
  );
}

export default Upgrade;

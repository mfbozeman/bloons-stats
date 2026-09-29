import Projectile from "./Projectile";
import styles from "./styles/StatView.module.css";

function StatView(props) {
  // we use: proj, attack, cost, genInfo
  // instead of info, pass in "portraitUrl", the name to be used, towerName, path, category

  const pathNums = props.block.id.slice(-3).split("").join("-");
  const name = props.block.id.slice(0, -3).replaceAll("_", " ").trim();

  // curr.id has towerName and path
  // split, remove underscores
  const info = (
    <div>
      <img src={props.portrait} alt="" className={styles["portrait"]} />

      <h2>{props.title}</h2>
      <p>
        {pathNums + " " + name}, {props.category}
      </p>
    </div>
  );

  // if an attack has no projectiles, it is either a buff or spawner
  if (props.attack.projectiles?.length < 0 || !props.proj) {
    return <></>;
  }

  // call both attack and projectile here
  const currProj = (
    <Projectile
      proj={props.proj}
      cost={props.cost}
      camo={props.attack.camo}
      rate={props.attack.rate}
      range={props.attack.attackRange}
    />
  );

  // attack, proj, land, (base info from Tower.jsx)
  return (
    <div className={styles["stat-card"]}>
      <div className={styles["info"]}>
        {info}
        {/* Land: {props.land ? "yes" : "no"} Water:{" "}
        {props.water ? "yes" : "no"} */}
      </div>
      <div className={styles["proj"]}>{currProj}</div>
    </div>
  );
}

export default StatView;

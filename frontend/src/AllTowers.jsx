import { useEffect, useState } from "react";
import styles from "./styles/AllTowers.module.css";
import { importTowers } from "./images";

const urls = importTowers();

function AllTowers() {
  const [loading, setLoading] = useState(true);
  const [towers, setTowers] = useState(null);
  // fetch all towers
  useEffect(() => {
    fetch("http://localhost:3000/tower/")
      .then((response) => response.json())
      .then((response) => {
        setTowers(response);
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  // for each tower
  // its portrait and a link to /tower/towerid
  const towersView = towers?.map((t) => {
    let imgUrl =
      "./assets/towers/180px-BTD6_000-" + t.name.replace(" ", "") + "_zZLs.png";
    return (
      <div className={styles.tower}>
        <a href={"/tower/" + t.id}>
          <h2>{t.name}</h2>
          <img src={urls[imgUrl]} alt="" />
        </a>
      </div>
    );
  });

  return loading ? (
    <>Loading...</>
  ) : (
    <section className={styles["all-towers"]}>
      <h1>All Towers</h1>
      <div className={styles["tower-list"]}>{towersView}</div>
    </section>
  );
}

export default AllTowers;

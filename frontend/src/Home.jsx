import { Link } from "react-router";
import Carousel from "./Carousel.jsx";

import styles from "./styles/Home.module.css";
import logo from "./assets/favicon.png";
import banner from "./assets/BTD6_share_banner_challenge.jpg";

function Home() {
  return (
    <>
      <section className={styles.hero}>
        <Carousel />
        <h1>Stats for Bloons TD6</h1>
        <h2>
          <img src={logo} alt="" className={styles.logo} />
          Welcome! This is a hub for BTD6 players to plan strategies, check
          data, and compare towers.
        </h2>
        <Link to="/tower" className="cta">
          See all towers
        </Link>
      </section>

      <section className={styles.second} id="features">
        <h2>Features</h2>
        <div className={styles.feature}>
          <Link to="/tower">
            <h3>Browse Towers</h3>
          </Link>
          <ul>
            <li>See stats for every tower</li>
            <li>Toggle upgrades</li>
            <li>Easily compare crosspaths</li>
          </ul>
        </div>
        <div className={styles.feature}>
          <h3>coming soon: Tower Rankings</h3>
          <ul>
            <li>Rank towers by pierce, damage, DPS, etc.</li>
            <li>Directly compare multiple towers</li>
            <li>
              Filter towers by cost, damage type, camo detection, and more
            </li>
          </ul>
        </div>
        <div className={styles.feature}>
          <h3>coming soon: Type Coverage Chart</h3>
          <ul>
            <li>Check your defense for weaknesses</li>
            <li>
              Select a series of towers, set their paths, and see your coverage
              of each bloon type mapped out in one chart
            </li>
            <li>Compare your defense with first appearance data and income </li>
            <li>Switch between attacks and projectiles</li>
          </ul>
        </div>
      </section>
    </>
  );
}

export default Home;

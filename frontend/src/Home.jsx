import { Link } from "react-router";
import styles from "./styles/Home.module.css";
import banner from "./assets/BTD6_share_banner_challenge.jpg";
import logo from "./assets/favicon.png";

function Home() {
  return (
    <>
      <section className={styles.hero}>
        {/* <img className={styles.banner} src={banner} alt="" /> */}
        <h1>Stats for Bloons TD6</h1>
        <h2>
          Welcome! A hub for you to plan strategies, check data, and compare
          towers.
        </h2>
        <Link to="/tower" className="cta">
          See All Towers
        </Link>
      </section>

      <section className={styles.second} id="features">
        <h2>Features</h2>
        <div className={styles.feature}>
          <Link to="/tower">Browse Towers</Link>
          <ul>
            <li>See stats for every tower</li>
            <li>Toggle upgrades</li>
            <li>Easily compare crosspaths</li>
          </ul>
        </div>
        <div className={styles.feature}>
          coming soon: Tower Rankings
          <ul>
            {/* Dev note: We are actually ranking stat blocks here --- or are they
              even attacks, projectiles
            
              Rank stat blocks with proper pagination, since there's a lot of
              them - we'll have to get into their indivdual attacks and projs
              too */}
            <li>Rank towers by pierce, damage, DPS, etc.</li>
            <li>Directly compare multiple towers</li>
            <li>
              Filter towers by cost, damage type, camo detection, and more
            </li>
          </ul>
        </div>
        <div className={styles.feature}>
          coming soon: Type Coverage Chart
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

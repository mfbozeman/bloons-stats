import styles from "./styles/Carousel.module.css";
import { Link } from "react-router";
import { useRef, useState, useEffect } from "react";
import StatView from "./StatView";

import left from "./assets/chevron-left.svg";
import right from "./assets/chevron-right.svg";

function Carousel() {
  const frame = useRef(null);
  const [index, setIndex] = useState(1);

  // eventually will be completely random?
  // const examples = ["Boomerang_Monkey_500", "Monkey_Sub_040", "Bomb_Shooter_005", "Dart_Monkey_500"];
  // loading state?
  // end with a see more option?

  function isActive(i) {
    return index === i ? styles.active : styles.inactive;
  }

  useEffect(() => {
    frame.current.scroll(430, 0);
  }, []);

  // change to Mermonkey or to random towers?
  // TODO: stuttering on wrap
  const stats = [
    <div className={isActive(-1)}>
      <StatView id={"Mermonkey_050"} cost={550} category={"Magic"} />
    </div>,
    <div className={isActive(0)}>
      <StatView id={"Mermonkey_000"} cost={550} category={"Magic"} />
    </div>,
    <div className={isActive(1)}>
      <StatView id={"Mermonkey_020"} cost={550} category={"Magic"} />
    </div>,
    <div className={isActive(2)}>
      <StatView id={"Mermonkey_030"} cost={550} category={"Magic"} />
    </div>,
    <div className={isActive(3)}>
      <StatView id={"Mermonkey_040"} category={"Magic"} />
    </div>,
    <div className={isActive(4)}>
      <StatView id={"Mermonkey_050"} cost={550} category={"Magic"} />
    </div>,
    <div className={isActive(5)}>
      <StatView id={"Mermonkey_000"} cost={550} category={"Magic"} />
    </div>,
    <div className={isActive(6)}>
      <StatView id={"Mermonkey_020"} cost={550} category={"Magic"} />
    </div>,
    <div className={isActive(7)}>
      <StatView id={"Mermonkey_030"} cost={550} category={"Magic"} />
    </div>,
  ];
  // advance moves forward x pixels
  // function to get div at that new position?
  function advance() {
    let offset = frame.current.scrollLeft;
    frame.current.scroll({ top: 0, left: offset + 250, behavior: "smooth" });
    if (index > 4) {
      setIndex((n) => n + 1);
      setTimeout(() => {
        setIndex(1);
        frame.current.scroll(430, 0);
      }, 500);
      // to wrap:
      // after calling scroll, reset the position and index
    } else {
      setIndex((n) => n + 1);
    }
  }
  // back moves back x pixels
  function back() {
    let offset = frame.current.scrollLeft;
    frame.current.scroll({ top: 0, left: offset - 250, behavior: "smooth" });
    setIndex((n) => n - 1);
    if (index < 2) {
      setTimeout(() => {
        setIndex(5);
        frame.current.scroll(1435, 0);
      }, 500);
    }
  }

  // main smaller cards on the sides, lighter and behind
  // transform the active to larger, have shadow, etc. etc.
  // active index
  return (
    <>
      <div className={styles.outerframe} ref={frame}>
        <div className={styles.carousel}>{stats}</div>
      </div>
      <button onClick={advance} className={styles.arrow}>
        <img src={right} alt="" />
      </button>
      <button onClick={back} className={styles.arrow}>
        <img src={left} alt="" />
      </button>
    </>
  );
}

export default Carousel;

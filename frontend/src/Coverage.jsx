import { useEffect } from "react";
import { importBloons } from "./images";
import noBloon from "./assets/No_bloon.svg";
import yesBloon from "./assets/Yes_bloon.svg";

// TODO: import issue?

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
const stdRounds = ["N/A", 20, 22, 25, 28, 24, 90];
const camoRounds = [42, 37, 45, 59];
const abrRounds = ["N/A", 7, 14, 15, 10, 5, "88*"];
const abrCamo = [24, 31, 45, 24];

function Coverage() {
  // useEffect()

  // map a <th> for each round number
  const roundNums = stdRounds.map((str) => {
    return <td>{str}</td>;
  });

  // toggling show camo variants
  // column sorting?
  // cost calculations?

  // probably a component for each existing row

  const bloonImages = bloonTypes.map((str) => {
    const bloonUrl = "./assets/bloons/BTD6_bloon_" + str + ".png";
    return (
      <th>
        <img src={images[bloonUrl]} alt={str} />
      </th>
    );
  });

  return (
    <>
      <table>
        <thead>
          <tr>{bloonImages}</tr>
          <tr>{roundNums}</tr>
        </thead>
        <tbody>
          <tr></tr>
        </tbody>
      </table>
      <p>Include a final column showing any gaps</p>
      <button>Plus (adds a row)</button>
      <form action="">
        <p>dropdown for name of tower</p>
        <button>Add</button>
      </form>
    </>
  );
}

export default Coverage;

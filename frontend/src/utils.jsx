// import images here and associate them with the proper tower / upgrade

// TODO: optimize?

function getCost(num, costMult) {
  // round to nearest 5
  return Math.round((num * costMult - 0.01) / 5) * 5;
}

// parameters: path as an array
// upgrades:
// tower base cost
// difficult mult
const getCumulCost = (path, upgrades, baseCost, mult = 1) => {
  let sum = baseCost;
  // have to sort upgrades....

  for (let i = 1; i < 4; i++) {
    for (let j = 1; j < path[i - 1]; j++) {
      sum += getCost(upgrades[i][j].cost, mult);
    }
  }
  return sum;
};

const towerImages = import.meta.glob("./assets/towers/*.png", {
  query: "?url",
  import: "default",
});

const portraitImages = import.meta.glob("./assets/portraits/*.png", {
  query: "?url",
  import: "default",
});

const upgradeImages = import.meta.glob(
  "./assets/upgrades/upgrade-icons/*.png",
  {
    query: "?url",
    import: "default",
  },
);

const bloonImages = import.meta.glob("./assets/bloons/*.png", {
  query: "?url",
  import: "default",
});

function importImages(images) {
  let obj = {};
  for (let i in images) {
    images[i]().then((response) => {
      obj[i] = response;
    });
  }
  return obj;
}

function importPortraits() {
  return importImages(portraitImages);
}

function importBloons() {
  return importImages(bloonImages);
}

// dynamic import instead?
function importUpgrades() {
  return importImages(upgradeImages);
}

function importTowers() {
  return importImages(towerImages);
}

// associate / separate into tower / bloon / upgrade ?

export {
  importTowers,
  importBloons,
  importUpgrades,
  importPortraits,
  getCumulCost,
};

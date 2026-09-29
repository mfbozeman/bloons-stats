// import images here and associate them with the proper tower / upgrade

// optimization?

// why not put these declarations in the functions? does it matter?

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

//dynamic import instead?
function importUpgrades() {
  return importImages(upgradeImages);
}

function importTowers() {
  return importImages(towerImages);
}

// associate / separate into tower / bloon / upgrade ?

export { importTowers, importBloons, importUpgrades, importPortraits };

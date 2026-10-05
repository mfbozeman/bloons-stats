import "dotenv/config";
import * as query from "./query.js";

export const getTower = async (req, res) => {
  const { towerId } = req.params;

  const tower = await query.readTowerById(towerId);

  res.send(tower);
};

export const getTowerFullInfo = async (req, res) => {
  const { towerId } = req.params;

  const tower = await query.readTowerRelations(towerId);

  res.send(tower);
};

export const getAllTowers = async (req, res) => {
  const towers = await query.readAllTowers();

  res.send(towers);
};

// get a stat block that will include projectiles and attacks
export const getStatBlock = async (req, res) => {
  const { statId } = req.params;

  const statBlock = {};

  res.send(statBlock);
};

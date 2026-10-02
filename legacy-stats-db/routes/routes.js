// defines the routes a user can request
// users are only allowed to read info
import { Router } from "express";
import controller from "../controllers/controller.js";
const router = Router();

// serve a tower and all related info
router.get("/tower/:towerId", controller.getTowerFullInfo);

router.get("/tower", controller.getAllTowers);

router.get("/", (req, res) => {
  res.send("you got the index route");
});

// serve a specific stat block
router.get("/stats/:statId", controller.getStatBlock);

// serve a specific attack

// serve a specific projectile

// serve ALL info?

// leave upgrades for now

export default router;

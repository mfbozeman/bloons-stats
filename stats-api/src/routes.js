import { Router } from "express";
import * as controller from "./controller.js";
const router = Router();

// serve a tower and all related info
router.get("/tower/:towerId", controller.getTowerFullInfo);

router.get("/tower", controller.getAllTowers);

router.get("/", (req, res) => {
  res.send("you got the index route");
});

router.get("/stats/:statId", controller.getStatBlock);

export default router;

import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import express from "express";
import router from "./routes.js";
import cors from "cors";

const db = drizzle(process.env.DATABASE_URL);
const app = express();

async function main() {
  // const session = require("express-session");

  // important middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.use("/", router);

  app.listen(3000, (err) => {
    if (err) {
      throw err;
    }
    console.log("now listening on port 3000");
  });
}

main();

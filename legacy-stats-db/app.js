import express from "express";
import router from "./routes/routes.js";
import cors from "cors";
// const session = require("express-session");

const app = express();
// important middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// session?

app.use("/", router);

app.listen(3000, (err) => {
  if (err) {
    throw err;
  }
  console.log("now listening on port 3000");
});

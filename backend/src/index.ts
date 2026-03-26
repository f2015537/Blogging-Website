import express from "express";
import v1Router from "./routes";
import "./config/env";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  return res.send("Hello");
});

app.use("/api/v1", v1Router);

app.listen(3000, () => {
  console.log("listening");
});

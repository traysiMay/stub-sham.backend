import "reflect-metadata";
const path = require("path");
require("dotenv").config(
  process.env.NODE_ENV === "development" && {
    path: path.resolve(__dirname, "../.env.development")
  }
);
import { createConnection } from "typeorm";

import express from "express";
import session from "express-session";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import io from "socket.io";

import routes from "./routes";
import sockets from "./sockets";
import { setToken } from "./utils";

const app = express();
app.use(session({ secret: "DOGSHIT" }));
app.locals.lastCreator = null;
app.locals.sale = undefined;
app.locals.picked = false;
const server = http.createServer(app);
export const ws = io(server);

app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.CLIENT,
    credentials: true
  })
);

(async () => {
  await createConnection();

  setToken();

  ws.on("connection", sockets);

  app.use("/", routes);

  server.listen(process.env.PORT);
})();

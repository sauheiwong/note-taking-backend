import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
// import utils from "./utils/utils.js";
dotenv.config();
import connectMongo from "connect-mongo";

import myRouter from "./router.js";

export const app = express(); // to be imported in index.js

app.set("view engine", "ejs");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views")); // views folder is where we keep our ejs files

// any files in public/ will be served as is (ex: images, css )
app.use(express.static(path.join(__dirname, "public"))); // public folder is where we keep our static files

// Bootstrap
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootswatch/dist/superhero"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);

app.use(cors());
app.use(express.json()); // no longer need body-parser; not needed after Express v4.16
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    },
    store: connectMongo.create({
      mongoUrl: process.env.DB_URL,
      collectionName: "sessions",
    }),
  })
);

app.use((req, res, next) => {
  // res.locals.u = utils;
  res.locals.currentPath = req.path; // current path
  res.locals.user = req.session.username; // user object
  next();
});

app.use("/api", myRouter.apiRouter);
app.use("/", myRouter.viewRouter);

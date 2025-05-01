import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();
import requireLogin from "./middleware/requireLogin.js";
import connectMongo from "connect-mongo";

import { router } from "./router.js";

export const app = express(); // to be imported in index.js

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

app.use("/api", router);

// app.use("/api/protected", requireLogin.requireLogin);

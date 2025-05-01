import dotenv from "dotenv";
dotenv.config();
import { connect } from "./connect.js"; // will connect to mongoDB
import { app } from "./server.js";

connect(process.env.DB_URL)
  .then(async (connection) => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((e) => console.error(e));

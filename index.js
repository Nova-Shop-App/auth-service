import sequelize from "./config/database.js";
import express from "express";

import dotenv from "dotenv";
import User from "./models/users.model.js";
import users from "./routes/user.route.js";
import auth from "./routes/auth.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/", auth);
app.use("/", users);

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  await User.sync();
  console.log(
    "The table for the Auth model was just (re)created! Successfully !"
  );

  console.log(`Auth service v1.0.1 listening On port ${port}!`);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, closing DB connection...");
  await sequelize.close();
  process.exit(0);
});

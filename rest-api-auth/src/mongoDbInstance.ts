import mongoose from "mongoose";

import config from "./config/config";

mongoose.connect(config.db.URI);
mongoose.set("strictQuery", true);

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MONGODB CONNECTION STABLISHED");
});

connection.on("error", (err) => {
  console.error(err);
  process.exit(0);
});

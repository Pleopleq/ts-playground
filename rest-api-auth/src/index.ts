import app from "./app";
import "./mongoDbInstance";

app.listen(app.get("port"), () => {
  console.log("[SERVER]: Running on port: " + app.get("port"));
});

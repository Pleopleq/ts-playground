import app from "./app";

app.listen(app.get("port"), () => {
  console.log("[SERVER]: Running on port: " + app.get("port"));
});

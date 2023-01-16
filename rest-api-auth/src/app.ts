import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("logger", morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

export default app;

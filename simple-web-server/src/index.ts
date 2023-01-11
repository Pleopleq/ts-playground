import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Client } from "pg";
dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const app: Express = express();
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/", async (req: Request, res: Response) => {
  const userLoggedRes = await client.query(
    "SELECT * FROM users WHERE name = $1",
    [req.body.username]
  );

  if (
    userLoggedRes.rows.length === 0 ||
    userLoggedRes.rows[0].password !== req.body.password
  ) {
    return res.status(500).send(`
    <h1>Wrong password or username</h1>
    <a href="/">Go to home</a>
    `);
  }

  res.status(200).send("Welcome");
});

app.get("/register", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/views/register.html");
});

app.post("/register", async (req: Request, res: Response) => {
  await client.query(
    "INSERT INTO users(name, password) VALUES($1, $2)",
    [req.body.username, req.body.password]
  );

  res.send(`
  <h1>User has been succesfully registered</h1>
  <a href="/">Go to home</a>
  `);
});

app.get("/users", async (req: Request, res: Response) => {
  const usersRes = await client.query("SELECT * FROM users;");
  res.json(usersRes.rows);
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    "[SERVER]: Server is running on port: " + process.env.SERVER_PORT
  );
});

client.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log(
      "[DB]: Server is connected to DATABASE: " + process.env.DB_NAME
    );
  }
});

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Client } from "pg";
import crypto from "crypto"
import passport from "passport"
import passportLocal from "passport-local"

dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

passport.use(new passportLocal.Strategy(function verify(username: string, password: string, cb: Function) {
  client.query('SELECT * FROM users WHERE name = ?', [username], function (err: any, row: any) {
    if (err) { return cb(err); }

    if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

    crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
      if (err) { return cb(err); }

      if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }

      return cb(null, row);
    });
  });
}));

const app: Express = express();
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

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

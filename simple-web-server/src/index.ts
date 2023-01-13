import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { Client } from "pg";
import crypto from "crypto"
import passport from "passport"
import passportLocal from "passport-local"
import session from 'express-session';

type User = {
  _id?: number,
  _name?: string
}

dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

passport.use(new passportLocal.Strategy(function verify(username: string, password: string, cb: Function) {
  client.query('SELECT * FROM users WHERE name = $1', [username], function (err: any, row: any) {
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
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate('session'));
app.use(express.urlencoded({ extended: true }));

passport.serializeUser(function(user: User, cb) {
  process.nextTick(function() {
    cb(null,{ id: user._id, username: user._name});
  });
});

passport.deserializeUser(function(user: User, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

app.get("/", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post('/login/password', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/'
}));

app.get("/register", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/views/register.html");
});

app.post("/register", (req: Request, res: Response, next: NextFunction) => {
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
    if (err) { return next(err); }

    await client.query(
      "INSERT INTO users(name, password, salt) VALUES($1, $2, $3) RETURNING *",
      [req.body.username, hashedPassword.toString("hex"), salt.toString("hex")]
    ) 
    .then(data => {
      req.login(data.rows[0], function(err) {
        if (err) { return next(err); }

        res.redirect('/dashboard');
      });
    })
    .catch(e => console.error(e.stack))
  })
})

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

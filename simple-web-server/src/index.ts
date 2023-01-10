import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import { Client } from "pg"
dotenv.config()

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as unknown as number,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/views/index.html")
})

app.listen(process.env.SERVER_PORT, () => {
    console.log("[SERVER]: Server is running on port: " + process.env.SERVER_PORT)
})

client.connect((err) => {
    if (err) {
        console.error('connection error', err.stack)
    } else {
        console.log('[DB]: Server is connected to DATABASE')
    }
})
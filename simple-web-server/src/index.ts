import express, { Express, Request, Response } from "express"

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
    res.send("EXPRESS + TYPESCRIPT BASIC SERVER");
})

app.listen(3000, () => {
    console.log("[SERVER]: Server is running on port 3000")
})
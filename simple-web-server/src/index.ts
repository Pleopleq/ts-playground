import express, { Express, Request, Response } from "express"

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/views/index.html")
})

app.listen(3000, () => {
    console.log("[SERVER]: Server is running on port 3000")
})
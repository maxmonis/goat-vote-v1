const express = require("express")
const connectDB = require("./config/db")
const path = require("path")

import {Request, Response} from "express"

const app = express()

connectDB()

app.use(express.json({extended: false}))

app.use("/api/rankings", require("./routes/rankings"))
app.use("/api/search", require("./routes/search"))

if (process.env.NODE_ENV === "production") {
  app.use(express.static("app/build"))
  app.get("*", (_req: Request, res: Response) =>
    res.sendFile(path.resolve(__dirname, "app", "build", "index.html"))
  )
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})

export {}

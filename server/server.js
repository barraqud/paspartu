//?================================================= Server.js, Deps ====================================================?//
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("dotenv").config()
const mongoose = require("./modules/database/mongo")
const router = require("./modules/routes/router")
const errorMiddleware = require("./modules/middleware/errorMiddleware")
//?================================================= Express ============================================================?//
const port = process.env.PORT || 3001
const app = express()
app.use(
  cors({
    credentials: true,
    origin: `${process.env.CLIENT_URL}:${process.env.CLIENT_PORT}`,
  }),
)
app.use(express.json())
app.use(cookieParser())
app.use("/api", router)
app.use(errorMiddleware)

//?================================================= Listen PORT ========================================================?//
const startServer = async () => {
  try {
    app.listen(port, () => console.log("Server started at ", port, " 🖥️"))
  } catch (e) {
    console.log(e)
  }
}
startServer()

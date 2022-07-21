const mongoose = require("mongoose")

// const db_url = `mongodb+srv://${process.env.MONGO_ID}:${process.env.MONGO_PASSWORD}@test-0.07yjv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const db_url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin&retryWrites=true&w=majority`

mongoose.connect(db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.connection.once("open", () => console.log("MongoDB connected 💾"))
mongoose.connection.on("error", error => console.log(error))

module.exports = mongoose

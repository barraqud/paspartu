const { Schema, model } = require("mongoose")

const VisitorModel = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  firstName: { type: String, default: "" },
  secondName: { type: String, default: "" },
  surname: { type: String, default: "" },
  maidenName: { type: String },
  visited: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
  reserved: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
})

module.exports = model("Visitor", VisitorModel)

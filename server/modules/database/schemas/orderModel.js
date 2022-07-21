const { Schema, model } = require("mongoose")

const OrderModel = new Schema({
  lesson: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
  visitor: { type: Schema.Types.ObjectId, ref: "Visitor", required: true },
  discount: { type: Schema.Types.ObjectId, ref: "Discount" },
  price: { type: [Number], validate: v => Array.isArray(v) && !!v.length },
  status: {
    type: String,
    required: true,
    default: "created",
    enum: ["created", "payed", "completed", "canceled"],
  },
})

module.exports = model("Order", OrderModel)

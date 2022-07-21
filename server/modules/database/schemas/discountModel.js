const { Schema, model } = require("mongoose")

const DiscountModel = new Schema({
  type: { type: String, required: true, default: "Стандартная", enum: ["Стандартная", "Персональная", "Минимальная", "Дополнительная"] },
  owner: { type: Schema.Types.ObjectId, ref: "Visitor", required: true },
  expiresIn: { type: Date, required: true, default: Date.now(), expires: 60 * 60 * 24 * 30 },
  trigger: { type: String, required: true, default: "Администратор", enum: ["Администратор", "Купон", "СММ", "Ссылка"] },
  value: { type: Number, required: true, default: 500 },
  used: { type: Date },
  order: { type: Schema.Types.ObjectId, ref: "Order" },
})

module.exports = model("Discount", DiscountModel)

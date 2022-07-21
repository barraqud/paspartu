const { Schema, model } = require("mongoose")

const DisciplineModel = new Schema({
  title: { type: String, required: true },
  educator: { type: Schema.Types.ObjectId, ref: "Educator" },
  schedule: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
  duration: { type: Number, required: true, default: 1000 * 60 * 60 * 2 },
  department: {
    type: String,
    required: true,
    unique: true,
    default: "Мастерская на Садовом",
    enum: {
      values: ["Мастерская на Садовом", "Мастерская на Чистых прудах"],
      message: "{VALUE} не соответствует списку адресов",
    },
  },
  cron: [{ type: String }],
  course: { type: String },
  masterclass: { type: Boolean, default: false },
  price: { type: Number, required: true },
  toolsPrice: { type: Number, required: true },
  onlinePrice: { type: Number, required: true },
})

module.exports = model("Discipline", DisciplineModel)

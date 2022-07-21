const { Schema, model } = require("mongoose")

const LessonModel = new Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  discipline: { type: Schema.Types.ObjectId, ref: "Discipline" },
  visitors: [{ type: Schema.Types.ObjectId, ref: "Visitor" }],
  reserves: [{ type: Schema.Types.ObjectId, ref: "Visitor" }],
})

module.exports = model("Lesson", LessonModel)

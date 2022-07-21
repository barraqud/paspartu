const { Schema, model } = require("mongoose")

const EducatorModel = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  firstName: { type: String, default: "" },
  secondName: { type: String, default: "" },
  surname: { type: String, default: "" },
  maidenName: { type: String },
  disciplines: [{ type: Schema.Types.ObjectId, ref: "Discipline" }],
})

module.exports = model("Educator", EducatorModel)

const { Schema, model } = require("mongoose")

const UserModel = new Schema({
  phone: { type: Number, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  activationlink: { type: String, unique: true },
  activated: { type: Boolean, default: false },
  role: {
    type: String,
    required: true,
    default: "Visitor",
    enum: {
      values: ["Visitor", "Educator", "Admin"],
      message: "Роли {VALUE} не существует",
    },
  },
  theme: {
    type: String,
    enum: {
      values: ["light", "dark", "standart"],
      message: "Темы {VALUE} не существует",
    },
    default: "standart",
  },
})

module.exports = model("User", UserModel)

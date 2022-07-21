const bcrypt = require("bcrypt")
const ApiError = require("../../utils/ApiError")
const userService = require("./userService")

class PasswordService {
  async hashPassword(password) {
    const hashedPsw = await bcrypt.hash(password, 4)
    if (!hashedPsw) throw ApiError.BadRequest("Произошла ошибка при хэшировании пароля")
    return hashedPsw
  }
  async checkPassword(query = { email }, password) {
    const userData = await userService.getOneUser(query)
    if (!userData) throw ApiError.NotFound("Пользователь по данному запросу " + JSON.stringify(query))
    const verified = await bcrypt.compare(password, userData.password)
    if (!verified) throw ApiError.BadRequest("Пароль неверен")
    return userData
  }
}

module.exports = new PasswordService()

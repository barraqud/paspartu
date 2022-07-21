const ApiError = require("../../utils/ApiError")
const roleService = require("./roleService")
const userService = require("./userService")
const visitorService = require("./visitorService")

class AdminService {
  async setAdmin(userId) {
    const candidate = await userService.getOneUser({ _id: userId })
    if (!candidate) throw ApiError.NotFound("Пользователь по данному запросу " + JSON.stringify(query))
    if (candidate.role === "Educator") throw ApiError.BadRequest("Пользователь не может быть назначен администратором!")
    if (candidate.role === "Admin") throw ApiError.BadRequest("Пользователь уже назначен администратором!")
    await visitorService.deleteVisitor({ user: userId })
    const updated = await userService.updateUser({ _id: userId }, { role: "Admin" })
    if (!updated) throw ApiError.BadRequest("Произошла непредвиденная ошибка")
    return updated
  }
  async deleteAdmin(userId) {
    const candidate = await roleService.getRole(userId)
    if (!candidate.profile === "Admin") throw ApiError.BadRequest(`Пользователь ${userId} не является администратором`)
    await userService.updateUser({ _id: userId }, { role: "Visitor" })
    const updated = await visitorService.setVisitor(userId)
    return updated
  }
}

module.exports = new AdminService()

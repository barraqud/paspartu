const ApiError = require("../../utils/ApiError")
const userService = require("./userService")
const educatorService = require("./educatorService")
const visitorService = require("./visitorService")

class RoleService {
  async getRole(userId) {
    const userData = await userService.getOneUser({ _id: userId })
    if (!userData) throw ApiError.NotFound("Пользователь по данному запросу " + JSON.stringify(query))
    if (!userData.role) await visitorService.setVisitor(userId)
    if (userData.role === "Visitor") {
      const profileData = await visitorService.getOneVisitor({ user: userId })
      return { ...userData, profile: profileData, role: "Visitor" }
    }
    if (userData.role === "Educator") {
      const profileData = await educatorService.getOneEducator({ user: userId })
      return { ...userData, profile: profileData, role: "Educator" }
    }
    if (userData.role === "Admin") {
      return { ...userData, role: "Admin" }
    }
  }
}

module.exports = new RoleService()

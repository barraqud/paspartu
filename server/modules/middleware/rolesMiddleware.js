const ApiError = require("../../utils/ApiError")
const RoleService = require("../service/roleService")

module.exports = function (roles) {
  return async function (req, res, next) {
    try {
      const userId = req.user.id
      if (userId) {
        const { role, profile } = await RoleService.getRole(userId)
        req.role = role
        req.profile = profile
        if (roles.includes(role)) {
          return next()
        }
      }
      next(ApiError.UnauthorizedError())
    } catch (e) {
      return next(ApiError.BadRequest("Непредвиденная ошибка при проверке роли", e))
    }
  }
}

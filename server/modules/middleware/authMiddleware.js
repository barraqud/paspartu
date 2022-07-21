const ApiError = require("../../utils/ApiError")
const TokenService = require("../service/tokenService")

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return next(ApiError.UnauthorizedError())
    }
    const accessToken = authHeader.split(" ")[1]
    if (!accessToken) {
      return next(ApiError.UnauthorizedError())
    }
    const userData = TokenService.validateAccessToken(accessToken)
    if (!userData) {
      return next(ApiError.UnauthorizedError())
    }
    req.user = userData
    next()
  } catch (e) {
    return next(ApiError.UnauthorizedError())
  }
}

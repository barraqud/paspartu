const jwt = require("jsonwebtoken")
const ApiError = require("../../utils/ApiError")
const UserDTO = require("../../utils/userDTO")
const TokenModel = require("../database/schemas/tokenModel")

class TokenService {
  async generateTokens(user) {
    const userData = new UserDTO(user)
    const payload = { ...userData }
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "1h" })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" })
    await this.setToken(payload.id, refreshToken)
    return {
      user: payload,
      accessToken,
      refreshToken,
    }
  }
  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return userData
    } catch (e) {
      return null
    }
  }
  async validateRefreshToken(token) {
    try {
      if (!token) throw ApiError.UnauthorizedError()
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      const savedToken = await this.getToken(userData.id)
      if (savedToken !== token) {
        throw ApiError.UnauthorizedError()
      }
      return userData
    } catch (e) {
      return null
    }
  }
  async setToken(user, refreshToken) {
    const tokenData = await TokenModel.findOne({ user })
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    const token = await TokenModel.create({ user, refreshToken })
    return token
  }
  async deleteToken(refreshToken) {
    const tokenData = await TokenModel.deleteOne({ refreshToken })
    if (!tokenData) throw ApiError.NotFound("Refresh токен")
    return tokenData
  }
  async getToken(user) {
    const { refreshToken } = await TokenModel.findOne({ user })
    if (!refreshToken) throw ApiError.NotFound("Refresh токен")
    return refreshToken
  }
}

module.exports = new TokenService()

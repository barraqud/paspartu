const ApiError = require("../../utils/ApiError")
const educatorService = require("./educatorService")
const passwordService = require("./passwordService")
const tokenService = require("./tokenService")
const userService = require("./userService")
const visitorService = require("./visitorService")

class AuthService {
  async signUp(phone, email, password, firstName, secondName, surname, maidenName) {
    const candidate = await userService.getOneUser({ $or: [{ phone }, { email }] })
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с ${phone} или ${email} уже зарегистрирован`)
    }
    const hashedPsw = await passwordService.hashPassword(password)
    const newUser = await userService.setUser(phone, email, hashedPsw)
    const { user, accessToken, refreshToken } = await tokenService.generateTokens(newUser)
    const profile = await visitorService.setVisitor(user.id, firstName, secondName, surname, maidenName)
    return { user, profile, accessToken, refreshToken }
  }
  async signIn(phone, email, password) {
    const request = phone ? { phone } : { email }
    const payload = await passwordService.checkPassword(request, password)
    const { user, accessToken, refreshToken } = await tokenService.generateTokens(payload)
    return { user, accessToken, refreshToken }
  }
  async signOut(refreshToken) {
    const tokenData = await tokenService.deleteToken(refreshToken)
    return tokenData
  }
  async refresh(refreshToken) {
    const { id } = await tokenService.validateRefreshToken(refreshToken)
    const user = await userService.getOneUser({ _id: id })
    if (!user) throw ApiError.NotFound("Пользователь по данному запросу " + JSON.stringify(query))
    const userData = await tokenService.generateTokens(user)
    return userData
  }
  async getProfile(user, role) {
    if (role === "Visitor") {
      const profile = visitorService.getOneVisitor({ user })
      return profile
    }
    if (role === "Educator") {
      const profile = educatorService.getOneEducator({ user })
      return profile
    }
    if (role === "Admin") {
      return "Admin"
    }
    return
  }
  async activateAccount(activationlink) {
    const newLink = userService.generateLink()
    const activated = await userService.updateUser({ activationlink }, { activated: true, activationlink: newLink })
    return activated
  }
  async restorePassword(activationlink, newPassword) {
    const password = await passwordService.hashPassword(newPassword)
    const newLink = userService.generateLink()
    const updated = await userService.updateUser({ activationlink }, { password, activationlink: newLink })
    return updated
  }
}

module.exports = new AuthService()

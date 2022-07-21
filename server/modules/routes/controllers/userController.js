const { validationResult } = require("express-validator")
const ApiError = require("../../../utils/ApiError")
const authService = require("../../service/authService")
const mailService = require("../../service/mailService")
const userService = require("../../service/userService")

class UserController {
  async signup(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Введены некорректные данные", errors.array()))
      }
      const { phone, email, password, firstName, secondName, surname, maidenName } = req.body
      const userData = await authService.signUp(phone, email, password, firstName, secondName, surname, maidenName)
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      return res.status(200).json(userData)
    } catch (e) {
      next(e)
    }
  }
  async signin(req, res, next) {
    try {
      const { phone, email, password } = req.body
      const userData = await authService.signIn(phone, email, password)
      const profile = await authService.getProfile(userData.user.id, userData.user.role)
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      return res.status(200).json({ user: userData.user, accessToken: userData.accessToken, profile })
    } catch (e) {
      next(e)
    }
  }
  async signout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      await authService.signOut(refreshToken)
      res.clearCookie("refreshToken")
      return res.status(200).json(true)
    } catch (e) {
      next(e)
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await authService.refresh(refreshToken)
      const profile = await authService.getProfile(userData.user.id, userData.user.role)
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      return res.status(200).json({ user: userData.user, accessToken: userData.accessToken, profile })
    } catch (e) {
      next(e)
    }
  }
  async activate(req, res, next) {
    try {
      const { link } = req.params
      const activated = await authService.activateAccount(link)
      if (activated) {
        return res.redirect(`${process.env.CLIENT_URL}:${process.env.CLIENT_PORT}/signin/${activated.email}`)
      }
    } catch (e) {
      next(e)
    }
  }
  async forgot(req, res, next) {
    try {
      const { email, link, password } = req.body
      if (email) {
        const user = await userService.getOneUser({ email })
        await mailService.sendResetPasswordLink(email, user?.activationLink)
        return res.status(200)
      }
      if (link && password) {
        const userData = await authService.restorePassword(link, password)
        if (userData) {
          return res.redirect(`${process.env.CLIENT_URL}:${process.env.CLIENT_PORT}/signin/${userData.email}`)
        }
      }
    } catch (e) {
      next(e)
    }
  }
  async changeTheme(req, res, next) {
    try {
      const { theme } = req.params
      const { id } = req.user
      if (["light", "dark", "standart"].includes(theme)) {
        const update = await userService.updateUser({ id }, { theme })
        return res.status(200).json(update)
      }
      return next(ApiError.BadRequest('Неправильно указана тема("light", "dark", "standart")'))
    } catch (e) {
      next(e)
    }
  }
  async sendQuestion(req, res, next) {
    try {
      const { sender, message } = req.body
      const mail = await mailService.sendQuestion(sender, message)
      res.status(200).json({ mail })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserController()

const ApiError = require("../../utils/ApiError")
const uuid = require("uuid")
const UserModel = require("../database/schemas/userModel")
const visitorService = require("./visitorService")
const educatorService = require("./educatorService")
const tokenService = require("./tokenService")

class UserService {
  async setUser(phone, email, password) {
    const activationlink = this.generateLink()
    const candidate = await UserModel.create({ phone, email, password, activationlink })
    if (!candidate) throw ApiError.BadRequest("Не получилось создать пользователя с " + JSON.stringify({ phone, email, password, activationlink }))
    return candidate
  }
  async getOneUser(query) {
    const candidate = await UserModel.findOne(query)
    return candidate
  }
  async getUserWithRole({ _id }) {
    const user = await this.getOneUser({ _id })
    if (user?.role === "Visitor") {
      const card = await visitorService.getOneVisitor({ user: _id })
      return { user, card }
    }
    if (user?.role === "Educator") {
      const card = await educatorService.getOneEducator({ user: _id })
      return { user, card }
    }
    if (user?.role === "Admin") {
      return { user }
    }
    throw ApiError.NotFound("Пользователя c данным id: " + _id)
  }
  async getManyUsers(count, skip) {
    const pagination = { ...(count && { limit: parseInt(count), skip: 0 }), ...(skip && { skip: parseInt(skip) }) }
    const userList = await UserModel.find({}, {}, pagination) //TODO { skip: page * perPage, limit: perPage } make pagination
    if (!userList) throw ApiError.NotFound("Список пользователей по данному запросу " + JSON.stringify(query))

    return userList
  }
  async updateUser(query, update) {
    const updatedUser = await UserModel.findOneAndUpdate(query, { $set: update }, { new: true })
    if (!updatedUser) throw ApiError.NotFound("Пользователь по данному запросу " + JSON.stringify(query))
    return updatedUser
  }
  async deleteUser(userId) {
    const candidate = await this.getOneUser({ _id: userId })
    if (!candidate || candidate.role === "Admin") throw ApiError.NotFound("Пользователь c id " + userId)
    if (candidate.role === "Visitor") {
      await visitorService.deleteVisitor({ user: userId })
    }
    if (candidate.role === "Educator") {
      await educatorService.deleteEducator({ user: userId })
    }
    const refreshToken = await tokenService.getToken(userId)
    await tokenService.deleteToken(refreshToken)
    const removed = await UserModel.deleteOne({ _id: userId })
    return removed.deletedCount
  }
  generateLink() {
    return uuid.v4()
  }
}

module.exports = new UserService()

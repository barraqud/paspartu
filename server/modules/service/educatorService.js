const ApiError = require("../../utils/ApiError")
const EducatorModel = require("../database/schemas/educatorModel")
const visitorService = require("./visitorService")

class EducatorService {
  async getOneEducator(query = { user }) {
    const educatorData = await EducatorModel.findOne(query)
    if (!educatorData) throw ApiError.NotFound("Преподаватель по данному запросу" + JSON.stringify(query))
    return educatorData
  }
  async getManyEducators(count, skip) {
    const pagination = { ...(count && { limit: parseInt(count), skip: 0 }), ...(skip && { skip: parseInt(skip) }) }
    const educatorsList = await EducatorModel.find({}, {}, pagination)
    if (!educatorsList) throw ApiError.NotFound("Преподаватели по данному запросу" + JSON.stringify(query))
    return educatorsList
  }
  async setEducator(user, optional) {
    await visitorService.deleteVisitor({ user })
    const profile = await EducatorModel.create({ user, ...optional })
    if (!profile) throw ApiError.BadRequest("Не получилось создать преподавателя по данному запросу " + JSON.stringify({ user, ...optional }))
    return profile
  }
  async setUpdateToEducator(query = { user }, update) {
    const updated = await EducatorModel.findOneAndUpdate(query, { $set: update }, { new: true })
    if (!updated) throw ApiError.BadRequest("Не получилось обновить преподавателя по данному запросу " + JSON.stringify(query))
    return updated
  }
  async pushUpdateToEducator(query = { user }, update) {
    const updated = await EducatorModel.findOneAndUpdate(query, { $push: update }, { new: true })
    if (!updated) throw ApiError.BadRequest("Не получилось обновить преподавателя по данному запросу " + JSON.stringify(query))
    return updated
  }
  async deleteEducator(query) {
    const deleted = await EducatorModel.findOneAndDelete(query)
    if (!deleted) throw ApiError.NotFound("Преподаватель по данному запросу" + JSON.stringify(query))
    return deleted
  }
}

module.exports = new EducatorService()

const ApiError = require("../../utils/ApiError")
const VisitorModel = require("../database/schemas/visitorModel")

class VisitorService {
  async getOneVisitor(query) {
    const candidate = await VisitorModel.findOne(query)
    if (!candidate) throw ApiError.NotFound("Слушатель")
    return candidate
  }
  async getManyVisitors(count, skip) {
    const pagination = { ...(count && { limit: parseInt(count), skip: 0 }), ...(skip && { skip: parseInt(skip) }) }
    const visitorsList = await VisitorModel.find({}, {}, pagination)
    if (!visitorsList) throw ApiError.NotFound("Список Слушателей по данному запросу " + JSON.stringify(query))
    return visitorsList
  }
  async setVisitor(user, firstName, secondName, surname, maidenName) {
    const request = { user, ...(firstName && { firstName }), ...(secondName && { secondName }), ...(surname && { surname }), ...(maidenName && { maidenName }) }
    const candidate = await VisitorModel.create(request)
    if (!candidate) throw ApiError.BadRequest(`Пользователю с id: ${user} не получилось создать слушателя`)
    return candidate
  }
  async updateVisitor(query = { user }, update) {
    const updated = await VisitorModel.findOneAndUpdate(query, { $set: update }, { new: true })
    if (!updated) throw ApiError.NotFound("Слушатель по данному запросу " + JSON.stringify(query))
    return updated
  }
  async deleteVisitor(query = { user }) {
    const removed = await VisitorModel.findOneAndDelete(query)
    if (!removed) throw ApiError.NotFound("Слушатель по данному запросу " + JSON.stringify(query))
    return removed
  }
}

module.exports = new VisitorService()

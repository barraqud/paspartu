const ApiError = require("../../utils/ApiError")
const DiscountModel = require("../database/schemas/discountModel")

class DiscountService {
  async getOneDiscount(query = { discountId }) {
    const discountData = await DiscountModel.findOne({ query })
    if (!discountData) throw ApiError.NotFound("Скидка по данному запросу " + JSON.stringify(query))
    return discountData
  }
  async getManyDiscounts(query = { owner }) {
    const discountsList = await DiscountModel.find(query)
    if (!discountsList) throw ApiError.NotFound("Скидки по данному запросу " + JSON.stringify(query))
    return discountsList
  }
  async setDiscount(owner, type, trigger, value) {
    const discountData = await DiscountModel.create({ owner, type, trigger, value })
    if (!discountData) throw ApiError.BadRequest("Не получилось создать преподавателя по данному запросу " + JSON.stringify({ owner, type, trigger, value }))
    return discountData
  }
  async updateDiscount(query, update) {
    const updated = await DiscountModel.findOneAndUpdate(query, { $set: update }, { new: true })
    if (!updated) throw ApiError.BadRequest("Не получилось обновить скидку по данному запросу ", +JSON.stringify(query, update))
  }
  async deleteDiscount(query = { discountId }) {
    const removed = await DiscountModel.findOneAndDelete(query)
    if (!removed) throw ApiError.BadRequest("Не получилось удалить скидку по данному запросу ", +JSON.stringify(query))
  }
}

module.exports = new DiscountService()

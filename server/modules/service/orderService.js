const ApiError = require("../../utils/ApiError")
const OrderModel = require("../database/schemas/orderModel")

class OrderService {
  async getOneOrder(_id) {
    const orderData = await OrderModel.findOne({ _id })
    if (!orderData) throw ApiError.NotFound("Заказ №" + _id)
    return orderData
  }
  async getManyOrder(query = { visitor }) {
    const ordersList = await OrderModel.find(query)
    if (!ordersList) throw ApiError.NotFound("Заказы по данному запросу " + JSON.stringify(query))
    return ordersList
  }
  async setOrder(lesson, visitor, discount, price = [...value]) {
    const orderData = await OrderModel.create({ lesson, visitor, discount, price })
    if (!orderData) throw ApiError.BadRequest("Ошибка при оформлении заказа с данными: " + JSON.stringify({ lesson, visitor, discount, price }))
    return orderData
  }
  async updateOrder(orderId, update) {
    const updated = await OrderModel.findByIdAndUpdate(orderId, { $set: update }, { new: true })
    if (!updated) throw ApiError.NotFound("Заказ " + orderId)
    return updated
  }
  async deleteOrder(orderId) {
    const removed = await OrderModel.findByIdAndDelete(orderId)
    if (!removed) throw ApiError.NotFound("Заказ " + orderId)
    return removed
  }
}

module.exports = new OrderService()

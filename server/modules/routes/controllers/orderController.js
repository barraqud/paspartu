const ApiError = require("../../../utils/ApiError")
const OrderService = require("../../service/orderService")

class OrderController {
  async getAllOrders(req, res, next) {
    try {
      const orders = await OrderService.getManyOrder()
      if (orders) {
        res.status(200).json(orders)
      }
    } catch (e) {
      next(e)
    }
  }
  async getManyOrders(req, res, next) {
    try {
      const orders = await OrderService.getOneOrder(req.user.id)
      if (orders) {
        res.status(200).json(orders)
      }
    } catch (e) {
      next(e)
    }
  }
  async getOneOrder(req, res, next) {
    try {
      const { id } = req.params
      const order = await OrderService.getOneOrder(id)
      if (order) {
        res.status(200).json(order)
      }
    } catch (e) {
      next(e)
    }
  }
  async changeOrder(req, res, next) {
    try {
      const { id } = req.params
      const { update } = req.body
      const order = await OrderService.updateOrder(id, update)
      if (order) {
        res.status(200).json(order)
      }
    } catch (e) {
      next(e)
    }
  }
  async deleteOrder(req, res, next) {
    try {
      const { id } = req.params
      const order = await OrderService.deleteOrder(id)
      if (order) {
        res.status(200).json({ complete: true })
      }
    } catch (e) {
      next(e)
    }
  }
  async createOrder(req, res, next) {
    try {
      const {
        profile,
        body: { lesson, discount, prices },
      } = req
      const order = await OrderService.setOrder(lesson, profile._id, discount, prices)
      if (order) {
        return res.status(200).json(order)
      }
      return ApiError.BadRequest("Не удалось создать заказ")
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new OrderController()

const DiscountService = require("../../service/discountService")

class DiscountController {
  async getAllDiscounts(req, res, next) {
    try {
      const discounts = await DiscountService.getManyDiscounts()
      if (discounts) {
        return res.status(200).json(discounts)
      }
    } catch (e) {
      next(e)
    }
  }
  async createDiscount(req, res, next) {
    try {
      const { visitor, type, trigger, value } = req.body
      const discount = await DiscountService.setDiscount(visitor, type, trigger, value)
      if (discount) {
        return res.status(200).json(discount)
      }
    } catch (e) {
      next(e)
    }
  }
  async deleteDiscount(req, res, next) {
    try {
      const { id } = req.params
      const discount = await DiscountService.deleteDiscount(id)
      if (discount) {
        return res.status(200).json({ complete: true })
      }
    } catch (e) {
      next(e)
    }
  }
  async activateDiscount(req, res, next) {
    try {
      const { _id } = req.params
      const { orderId } = req.body
      const discount = await DiscountService.updateDiscount({ _id }, { order: orderId, used: Date.now() })
      if (discount) {
        return res.status(200).json(discount)
      }
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new DiscountController()

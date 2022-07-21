const ApiError = require("../../../utils/ApiError")
const VisitorService = require("../../service/visitorService")

class VisitorController {
  async getAllVisitors(req, res, next) {
    try {
      const { count, skip } = req.query
      const visitors = await VisitorService.getManyVisitors(count, skip)
      if (visitors) {
        return res.status(200).json(visitors)
      }
    } catch (e) {
      next(e)
    }
  }
  async getOneVisitor(req, res, next) {
    try {
      const { id } = req.params
      const visitor = await VisitorService.getOneVisitor({ user: id })
      if (visitor) {
        return res.status(200).json(visitor)
      }
    } catch (e) {
      next(e)
    }
  }
  async updateVisitor(req, res, next) {
    try {
      const { id } = req.params
      const { update } = req.body
      const visitor = await VisitorService.updateVisitor({ user: id }, update)
      if (visitor) {
        return res.status(200).json(visitor)
      }
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new VisitorController()

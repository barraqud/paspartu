const ApiError = require("../../../utils/ApiError")
const EducatorService = require("../../service/educatorService")

class EducatorController {
  async getOneEducator(req, res, next) {
    try {
      const { id } = req.params
      const educator = await EducatorService.getOneEducator({ user: id })
      if (educator) {
        return res.status(200).json(educator)
      }
    } catch (e) {
      next(e)
    }
  }
  async getAllEducators(req, res, next) {
    try {
      const { count, skip } = req.query
      const educators = await EducatorService.getManyEducators(count, skip)
      if (educators) {
        return res.status(200).json(educators)
      }
    } catch (e) {
      next(e)
    }
  }
  async createEducator(req, res, next) {
    try {
      const { id, firstName, secondName, surname, maidenName } = req.body
      const profile = await EducatorService.setEducator(id, { firstName, secondName, surname, maidenName })
      const user = await userService.updateUser({ _id: id }, { role: "Educator" })
      if (profile && user) {
        const educator = { profile, user }
        return res.status(200).json(educator)
      }
      next(ApiError.BadRequest("Этот преподаватель уже назначен"))
    } catch (e) {
      next(e)
    }
  }
  async deleteEducator(req, res, next) {
    try {
      const { id } = req.params
      const educator = await EducatorService.deleteEducator({ _id: id })
      if (educator) {
        const educators = await EducatorService.getEducatorsService()
        return res.status(200).json(educators)
      }
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new EducatorController()

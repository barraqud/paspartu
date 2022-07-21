const ApiError = require("../../../utils/ApiError")
const LessonService = require("../../service/lessonService")

class LessonController {
  async getOneLesson(req, res, next) {
    try {
      const { id } = req.params
      const lessons = await LessonService.getOneLesson(id)
      if (lessons) {
        return res.status(200).json(lessons)
      }
    } catch (e) {
      next(e)
    }
  }
  async manageSubscription(req, res, next) {
    try {
      const { lessonId, visitorId, sub } = req.body
      if (sub) {
        const lesson = await LessonService.updateLesson(lessonId, { $push: { visitors: visitorId } })
        return res.status(200).json(lesson)
      }
      const lesson = await LessonService.updateLesson(lessonId, { $pull: { visitors: visitorId } })
      return res.status(200).json(lesson)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new LessonController()

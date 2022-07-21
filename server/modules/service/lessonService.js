const ApiError = require("../../utils/ApiError")
const LessonModel = require("../database/schemas/lessonModel")

class LessonService {
  async getOneLesson(lessonId) {
    const lessonData = await LessonModel.findOne({ _id: lessonId })
    if (!lessonData) throw ApiError.NotFound("Урок " + lessonId)
    return lessonData
  }
  async getManyLesson(query) {
    const lessonData = await LessonModel.find(query)
    if (!lessonData) throw ApiError.NotFound("Уроки по данному запросу " + JSON.stringify(query))
    return lessonData
  }
  async setOneLesson(startTime, endTime, discipline, department) {
    const lessonData = {
      _id: startTime,
      startTime,
      endTime,
      discipline,
      department,
    }
    const created = await LessonModel.create(lessonData)
    if (!created) throw ApiError.BadRequest("Не получилось создать урок")
    return created
  }
  async setManyLessons(lessonsArray) {
    const lessons = await LessonModel.insertMany(lessonsArray)
    if (!lessons) throw ApiError.BadRequest(`Не получилось создать ${lessonsArray.length} уроков`)
    return lessons
  }
  async updateLesson(query = { startTime }, update) {
    const lessonData = await LessonModel.findOneAndUpdate(query, update, { new: true })
    if (!lessonData) throw ApiError.BadRequest("Не получилось обновить урок по данному запросу " + JSON.stringify(query))
    return lessonData
  }
  async deleteOneLesson(lessonId) {
    const lessonData = await LessonModel.findByIdAndDelete(lessonId)
    if (!lessonData) throw ApiError.NotFound("Урок " + lessonId)
    return lessonData
  }
  async deleteManyLesson(query) {
    const { deletedCount } = await LessonModel.deleteMany(query)
    if (!deletedCount) throw ApiError.NotFound("Уроки по дисциплине " + query)
    return deletedCount
  }
}

module.exports = new LessonService()

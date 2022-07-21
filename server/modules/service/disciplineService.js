const cronParser = require("cron-parser")
const { Types } = require("mongoose")
const ApiError = require("../../utils/ApiError")
const disciplineModel = require("../database/schemas/disciplineModel")
const lessonService = require("./lessonService")

class DisciplineService {
  async getOneDiscipline(query = { disciplineId }) {
    const disciplineData = await disciplineModel.findOne(query)
    if (!disciplineData) throw ApiError.NotFound("Предмет(занятие) по данному запросу " + JSON.stringify(query))
    return disciplineData
  }
  async getManyDisciplines(count, skip) {
    const pagination = { ...(count && { limit: parseInt(count), skip: 0 }), ...(skip && { skip: parseInt(skip) }) }
    const disciplineList = await disciplineModel.find({}, {}, pagination)
    if (!disciplineList) throw ApiError.NotFound("Предмет(занятие) по данному запросу " + JSON.stringify(query))
    return disciplineList
  }
  async setDiscipline({ title, educator, duration, department, cron, course, masterclass, price, toolsPrice, onlinePrice }) {
    const disciplineData = await disciplineModel.create({ title, educator, duration, department, cron, course, masterclass, price, toolsPrice, onlinePrice })
    if (!disciplineData) throw ApiError.BadRequest("Не получилось создать предмет(занятие) по данному запросу " + JSON.stringify({}))
    return disciplineData
  }
  async updateDiscipline(query = { disciplineId }, update) {
    const updated = await disciplineModel.findOneAndUpdate(query, update, { new: true })
    if (!updated) throw ApiError.BadRequest("Не получилось обновить предмет(занятие) по данному запросу ", +JSON.stringify(query, update))
    return updated
  }
  async deleteDiscipline(query) {
    const removed = await disciplineModel.findByIdAndDelete(query)
    if (!removed) throw ApiError.BadRequest("Не получилось удалить предмет(занятие) по данному запросу ", +JSON.stringify(query))
    return removed.deletedCount
  }
  async createLessonsByCron(cronArray, duration, id, interval = 1) {
    const cronSchedule = Array.isArray(cronArray) && cronArray.map(cron => this.setCronSchedule(cron, interval, duration))
    const lessonArray = cronSchedule.map(({ startTime, endTime }) => ({
      _id: new Types.ObjectId(Math.floor(startTime / 1000)),
      startTime,
      endTime,
      discipline: id,
    }))
    const lessons = await lessonService.setManyLessons(lessonArray)
    const schedule = lessons.map(({ _id }) => _id)
    const discipline = await this.updateDiscipline({ _id: id }, { $push: { schedule } })
    return { discipline, lessons }
  }
  async createDisciplineAndLessons(options, interval = 1) {
    const newDiscipline = await this.setDiscipline(options)
    return await this.createLessonsByCron(options.cron, options.duration, newDiscipline._id, interval)
  }
  async deleteDisciplineAndLessons(_id) {
    const deletedCount = await lessonService.deleteManyLesson({ discipline: _id })
    const discipline = await this.deleteDiscipline({ _id })
    return { discipline, deletedCount }
  }
  async pushToDisciplineByCron(_id, cron, interval = 1) {
    const discipline = this.getOneDiscipline({ _id })
    if (cron) {
      return await this.createLessonsByCron(cron, discipline.duration, discipline._id, interval)
    }
    return await this.createLessonsByCron(discipline.cron, discipline.duration, discipline._id, interval)
  }
  async pullFromDiscipline(_id, schedule) {
    const lessons = await lessonService.deleteManyLesson({ _id: schedule.id })
    const newSchedule = lessons.map(({ _id }) => _id)
    const discipline = await this.updateDiscipline({ _id }, { $pull: { newSchedule } })
    return { discipline, schedule: newSchedule }
  }
  setCronSchedule(cron, month, duration) {
    const currentDate = new Date()
    const endDate = new Date().setMonth(new Date().getMonth() + month)
    const cronOpt = {
      currentDate,
      endDate,
      iterator: true,
      tz: "Europe/Moscow",
    }
    let schedule = []
    const interval = cronParser.parseExpression(cron, cronOpt)
    while (true) {
      try {
        const element = interval.next()
        const startTime = new Date(element.value.toString())
        const endTime = new Date(startTime.getTime() + duration)
        schedule.push({ startTime, endTime })
      } catch (e) {
        break
      }
    }
    return schedule
  }
  getTimestampFromSchedule(discipline) {
    return discipline.schedule.map(id => ({ id, timestamp: id.getTimestamp() }))
  }
}

module.exports = new DisciplineService()

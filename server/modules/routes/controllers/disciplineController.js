const disciplineService = require("../../service/disciplineService")
const educatorService = require("../../service/educatorService")

class DisciplineController {
  async createDiscipline(req, res, next) {
    try {
      const { title, educator, duration, department, cron, course, masterclass, price, toolsPrice, onlinePrice, interval } = req.body
      const { discipline, lessons } = await disciplineService.createDisciplineAndLessons(
        { title, educator, duration, department, cron, course, masterclass, price, toolsPrice, onlinePrice },
        interval,
      )
      const schedule = lessons.map(({ _id, startTime }) => ({ id: _id, timestamp: startTime }))
      res.status(200).json({ discipline, schedule })
    } catch (e) {
      next(e)
    }
  }
  async readOneDiscipline(req, res, next) {
    try {
      const { id } = req.params
      const discipline = await disciplineService.getOneDiscipline({ _id: id })
      const schedule = disciplineService.getTimestampFromSchedule(discipline)
      res.status(200).json({ discipline, schedule })
    } catch (e) {
      next(e)
    }
  }
  async readManyDiscipline(req, res, next) {
    try {
      const { count, skip } = req.query
      const disciplineArray = await disciplineService.getManyDisciplines(count, skip)
      const educatorsArray = await educatorService.getManyEducators()
      const disciplines = disciplineArray.map(d => d.toObject())
      const educators = educatorsArray.map(ed => ed.toObject())
      const result = disciplines.map(discipline => ({
        ...discipline,
        schedule: disciplineService.getTimestampFromSchedule(discipline),
        educator: educators.find(ed => discipline.educator.equals(ed._id)),
      }))
      res.status(200).json(result)
    } catch (e) {
      next(e)
    }
  }
  async updateOneDiscipline(req, res, next) {
    try {
      const { id, update } = req.body
      const discipline = await disciplineService.updateDiscipline({ _id: id }, update)
      const schedule = disciplineService.getTimestampFromSchedule(discipline)
      res.status(200).json({ discipline, schedule })
    } catch (e) {
      next(e)
    }
  }
  async pushLessonToDiscipline(req, res, next) {
    try {
      const { id, schedule, interval } = req.body
      const result = await disciplineService.pushToDisciplineByCron(id, schedule, interval)
      return res.status(200).json(result)
    } catch (e) {
      next(e)
    }
  }
  async pullLessonFromDiscipline(req, res, next) {
    try {
      const { id, schedule } = req.body
      const result = await disciplineService.pullFromDiscipline(id, schedule)
      return res.status(200).json(result)
    } catch (e) {
      next(e)
    }
  }
  async deleteOneDiscipline(req, res, next) {
    try {
      const { id } = req.params
      const result = await disciplineService.deleteDisciplineAndLessons(id)
      res.status(200).json(result)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new DisciplineController()

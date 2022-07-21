const AdminService = require("../../service/adminService")
const userService = require("../../service/userService")

class AdminController {
  async setAdmin(req, res, next) {
    try {
      const { id } = req.params
      const admin = await AdminService.setAdmin(id)
      res.status(200).json(admin)
    } catch (e) {
      next(e)
    }
  }
  async getUsers(req, res, next) {
    try {
      const { count, skip } = req.query
      const users = await userService.getManyUsers(count, skip)
      if (users) {
        return res.status(200).json(users)
      }
    } catch (e) {
      next(e)
    }
  }
  async getOneUser(req, res, next) {
    try {
      const { id } = req.params
      const user = await userService.getUserWithRole({ _id: id })
      res.status(200).json(user)
    } catch (e) {
      next(e)
    }
  }
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params
      const deleted = await userService.deleteUser(id)
      if (deleted) {
        return res.status(200).json({ complete: true })
      }
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new AdminController()

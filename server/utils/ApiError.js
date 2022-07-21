module.exports = class ApiError extends Error {
  status
  errors

  constructor(status, message, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
  }

  static UnauthorizedError() {
    return new ApiError(401, "Пользователь не авторизован")
  }

  static NotFound(target, errors = []) {
    return new ApiError(401, `${target} не найден!`, errors)
  }
  static BadRequest(message, errors = []) {
    return new ApiError(401, message, errors)
  }
  static notAnAdmin() {
    return new ApiError(403, "Нужно иметь права администратора")
  }
}

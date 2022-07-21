module.exports = class UserDTO {
  email
  id
  activated

  constructor(model) {
    this.id = model._id
    this.email = model.email
    this.activated = model.activated
    this.role = model.role
    this.theme = model.theme
  }
}

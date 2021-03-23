export class User {
  name = ''
  scratchpad = ''
  img = ''
  constructor(_name, _img, _scratchpad) {
    this.name = _name
    this.img = _img
    this.scratchpad = _scratchpad
  }
}

export class Gathering {
  id = null
  name = ''
  tagline = ''
  size = 25
  password = null
  admins = null
  circles = null
  constructor(_id, _name, _description, _size = 25, _password, _admins, _circles) {
    this.id = _id
    this.name = _name
    this.description = _description
    this.size = _size
    this.password = _password
    this.admins = _admins
    this.circles = _circles
  }
}

export class Circle {
  id = null
  name = ''
  allowChildren = true
  attendees = null
  circles = null
  parentPath = null
  constructor(name, _allowChildren = true) {
    this.name = name
    this.allowChildren = _allowChildren
  }
  path = () => `${this.parentPath}/circles/` + this.id
}

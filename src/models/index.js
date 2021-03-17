export class User {
  name = null
  scratchpad = null
  avatar = null
  constructor(name, avatar, scratchpad) {
    this.name = name
    this.avatar = avatar
    this.scratchpad = scratchpad
  }
}

export class Gathering {
  id = null
  name = ''
  description = ''
  size = 25
  admins = []
  circles = []
  password = null
  constructor(_name, _description, _size = 25, _password) {
    this.name = _name
    this.description = _description
    this.size = _size
    this.password = _password
  }
}

export class Circle {
  name = ''
  allowChildren = true
  attendees = []
  circles = []
  constructor(name, _allowChildren = true) {
    this.name = name
    this.allowChildren = _allowChildren
  }
}

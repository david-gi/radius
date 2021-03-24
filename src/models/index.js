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
  description = ''
  maxSize = 25
  password = null
  circles = null
  users = null
  constructor(_id, _name, _desc, _maxSize = 25, _password, _circles, _users) {
    this.id = _id
    this.name = _name
    this.description = _desc
    this.maxSize = _maxSize
    this.password = _password
    this.circles = _circles
    this.users = _users
  }
}

export class Circle {
  id = null
  name = ''
  attendees = null
  circles = null
  parentPath = null
  constructor(name) {
    this.name = name
  }
}

export class User {
  name = ''
  scratchpad = ''
  imgUrl = null
  constructor(name, scratchpad, imgUrl) {
    this.name = name
    this.scratchpad = scratchpad
    this.imgUrl = imgUrl
  }
}

export class Gathering {
  name = ''
  description = ''
  imgUrl = null
  maxParticipants = 25
  circles = []
  password = null
  constructor(name, description, imgUrl, maxSize = 25, password) {
    this.name = name
    this.description = description
    this.imgUrl = imgUrl
    this.maxParticipants = maxSize
    this.password = password
  }
}

export class Circle {
  name = ''
  allowChildren = true
  admins = []
  participants = []
  circles = []
  constructor(name, _allowChildren = true) {
    this.name = name
    this.allowChildren = _allowChildren
  }
}

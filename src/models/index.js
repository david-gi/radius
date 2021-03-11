export class User {
  id = null
  constructor(name, scratchpad, imgUrl) {
    this.name = name
    this.scratchpad = scratchpad
    this.imgUrl = imgUrl
  }
}

export class Gathering {
  id = null
  circles = []
  constructor(name, description, imgUrl, maxSize = 25, password) {
    this.name = name
    this.description = description
    this.imgUrl = imgUrl
    this.maxParticipants = maxSize
    this.password = password
  }
}

export class Circle {
  id = null
  admins = []
  participants = []
  circles = []
  constructor(name, allowChildren = true) {
    this.name = name
    this.allowChildren = allowChildren
  }
}

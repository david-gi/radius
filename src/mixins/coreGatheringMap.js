export default {
  data() {
    return {
      refreshTimer: null,
      cssModTimer: null,
      circleHightlightColor: 'var(--green)'
    }
  },

  methods: {
    initMap() {
      // Setup map
      const mapEl = document.getElementById('Map')
      const topEl = document.getElementById('top')
      this.map
        .data(this.nodes)
        .padding(80)
        .excludeRoot(true)
        .minCircleRadius(10)
        .width(topEl.clientWidth)
        .height(topEl.clientHeight)
        .color(this.setColor)
        .label(this.setLabel)
        .tooltipTitle(this.setTooltip)
        .tooltipContent(this.setTooltipContent)
        //.onHover()
        .onClick(this.nodeClick)(mapEl)
      this.applyStyling()
    },

    resizeChart() {
      const topEl = document.getElementById('top')
      this.map
        .width(topEl.clientWidth || '100vw')
        .height(topEl.clientHeight || '100vh')
      this.map.zoomReset()
    },

    refreshChart() {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = setTimeout(() => {
        this.map.data(this.nodes)
        this.applyStyling(false)
      }, 1000)
    },

    isCircle(node) {
      return node && node.value > 2
    },

    goToNode(node) {
      const zoomModel = {
        __dataNode: {
          r: node.__dataNode.r + 20,
          x: node.__dataNode.x,
          y: node.__dataNode.y
        }
      }
      this.map.zoomToNode(zoomModel)
    },

    goToRoot() {
      this.map.zoomReset()
      this.applyStyling()
      this.$store.dispatch('leaveCurrentCircle').then(() => {
        this.connections = []
        document.getElementsByTagName('audio').forEach(a => {
          a.remove()
        })
      })
    },

    findUser(node) {
      if (!this.$store.state.gathering || !this.$store.state.gathering.users) {
        return null
      }
      return this.$store.state.gathering.users.find(u => u.name === node.name)
    },

    findAttendee(node) {
      if (
        !this.$store.state.currentCircle ||
        !this.$store.state.currentCircle.attendees
      ) {
        return null
      }
      return this.$store.state.currentCircle.attendees.find(
        a => a.name === node.name
      )
    },

    setColor(node) {
      switch (node.value) {
        case 3:
          return 'var(--indigo)'
        default:
          return 'var(--blue)'
      }
    },

    setLabel(node) {
      if (!node || !node.name) return
      return this.sanitize(node.name)
    },

    setTooltip(node) {
      if (!node || !node.name) return
      return this.isCircle(node)
        ? `<u>${this.sanitize(node.name) || ''}</u>`
        : this.sanitize(node.name) || ''
    },

    setTooltipContent(node) {
      if (!node || !node.name) return
      if (this.isCircle(node)) {
        return this.currentCircle && node.name === this.currentCircle.name
          ? 'Right-click to add an inner circle.'
          : 'Click to zoom.<br> Double-click to join.'
      } else {
        const user = this.findAttendee(node)
        return user
          ? `<p class='text-wrap mt-2 mb-n1'>
              ${this.sanitize(user.scratchpad) || ''}
            </p>`
          : ''
      }
    },

    zoomToCurrent() {
      const circleSvgs = document.querySelectorAll('svg g circle')
      const currentNode = Array.from(circleSvgs).find(
        c => c.style.stroke === this.circleHightlightColor
      )
      if (currentNode) currentNode.dispatchEvent(new Event('click'))
    },

    applyStyling(showLoading = true) {
      if (showLoading) this.loadOn()
      clearTimeout(this.cssModTimer)
      this.cssModTimer = setTimeout(() => {
        let finishedCount = 0
        const svgLabels = document.querySelectorAll('svg g text')
        Array.from(svgLabels).forEach(svgLabel => {
          const circleSvg =
            svgLabel.parentElement.parentElement.parentElement.firstElementChild
          const circleSvgHtml = document.getElementById(circleSvg.id)
          circleSvg.style.stroke = 'var(--dark)'
          circleSvg.style.filter = 'none'
          circleSvg.style.fillOpacity = 1
          svgLabel.style.fillOpacity = 1
          const clipPathEl = svgLabel.parentElement.parentElement
          clipPathEl.parentElement.children.forEach(c => {
            if (c.tagName === 'image') {
              c.remove()
            }
          })

          if (++finishedCount === svgLabels.length) {
            setTimeout(() => {
              this.loadOff()
            }, 2000)
          }

          // Process Gathering Circle Nodes
          this.$store
            .dispatch('lookupCircle', svgLabel.textContent)
            .then(circleNodeData => {
              if (circleNodeData) {
                // eslint-disable-next-line prettier/prettier
                circleSvgHtml.removeEventListener('contextmenu', this.createCircle)
                const isCurrentCircle =
                  this.currentCircle &&
                  svgLabel.textContent === this.currentCircle.name
                if (isCurrentCircle) {
                  // reset zoom from node updates
                  circleSvgHtml.dispatchEvent(new Event('click'))
                  setTimeout(() => {
                    circleSvg.style.stroke = this.circleHightlightColor
                    circleSvg.style.filter =
                      'drop-shadow(0 0 12px var(--green))'
                  }, 100)
                  // attach create circle right-click event
                  // eslint-disable-next-line prettier/prettier
                  circleSvgHtml.addEventListener('contextmenu', this.createCircle)
                }
                return
              } else {
                // Process Attendee Circle Nodes
                this.$store
                  .dispatch('lookupAttendee', svgLabel.textContent)
                  .then(attendeeNodeData => {
                    let attendee = attendeeNodeData
                    if (!attendee) {
                      const currentUser = this.$store.state.user
                      if (currentUser.name === svgLabel.textContent) {
                        attendee = currentUser
                      } else return
                    }

                    const imgUrl = attendee ? attendee.img : ''
                    const img = document.createElementNS(
                      'http://www.w3.org/2000/svg',
                      'image'
                    )
                    const fitImg = () => {
                      const circleDiameter =
                        circleSvg.getBBox({stroke: true}).height + 2
                      img.setAttribute('x', -(circleDiameter / 2))
                      img.setAttribute('y', -(circleDiameter / 2))
                      img.setAttribute('height', circleDiameter)
                      img.setAttribute(
                        'style',
                        'cursor: pointer; pointer-events: none;'
                      )
                    }
                    img.setAttribute('href', imgUrl)
                    img.setAttribute(
                      'clip-path',
                      `${clipPathEl.getAttribute('clip-path')}`
                    )
                    fitImg()

                    clipPathEl.parentElement.append(img)
                    setTimeout(() => {
                      fitImg()
                    }, 500)
                  })
              }
            })
        })
      }, 1000)
    }
  }
}

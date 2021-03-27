export default {
  data() {
    return {
      refreshTimer: null,
      cssModTimer: null
    }
  },

  methods: {
    initMap() {
      this.$store.commit('SET_LOADING', true)
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
        .onHover(this.showUserCard)
        .onClick(this.nodeClick)(mapEl)
      this.applyCssMods()
      this.$store.commit('SET_LOADING', false)
    },

    resizeChart() {
      const topEl = document.getElementById('top')
      this.map.width(topEl.clientWidth).height(topEl.clientHeight)
    },

    refreshChart() {
      this.resizeChart()
      clearTimeout(this.refreshTimer)
      this.refreshTimer = setTimeout(() => {
        this.map.data(this.nodes)
        this.applyCssMods()
      }, 500)
    },

    isCircle(node) {
      return node && node.value > 2
    },

    goToRoot() {
      this.map.zoomReset()
      this.applyCssMods()
      this.$store.dispatch('leaveCurrentCircle').then(() => {
        this.connections = []
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
          ? 'Right-click to add an inner circle'
          : 'Click to join circle'
      } else {
        const user = this.findAttendee(node)
        return user
          ? `<p class='text-wrap mt-2 mb-n1'>
              ${this.sanitize(user.scratchpad) || ''}
            </p>`
          : ''
      }
    },

    applyCssMods() {
      clearTimeout(this.cssModTimer)
      this.cssModTimer = setTimeout(() => {
        const svgLabels = document.querySelectorAll('svg g text')
        Array.from(svgLabels).forEach(svgLabel => {
          const circleSvg =
            svgLabel.parentElement.parentElement.parentElement.firstElementChild
          const circleSvgHtml = document.getElementById(circleSvg.id)
          circleSvg.style.stroke = 'var(--dark)'
          circleSvg.style.fillOpacity = 1
          svgLabel.style.fillOpacity = 1
          const clipPathEl = svgLabel.parentElement.parentElement
          clipPathEl.parentElement.children.forEach(c => {
            if (c.tagName === 'image') {
              c.remove()
            }
          })

          // Process Gathering Circles
          this.$store
            .dispatch('lookupCircle', svgLabel.textContent)
            .then(circleNodeData => {
              if (circleNodeData) {
                // eslint-disable-next-line prettier/prettier
                circleSvgHtml.removeEventListener('contextmenu', this.createCircle)
                circleSvgHtml.removeEventListener('contextmenu', this.goToRoot)
                const isCurrentCircle =
                  this.currentCircle &&
                  svgLabel.textContent === this.currentCircle.name
                if (isCurrentCircle) {
                  circleSvg.style.stroke = 'var(--green)'
                  // attach create circle right-click event
                  // eslint-disable-next-line prettier/prettier
                  circleSvgHtml.addEventListener('contextmenu', this.createCircle)
                  // reset zoom from node updates
                  setTimeout(() => {
                    circleSvgHtml.dispatchEvent(new Event('click'))
                  }, 500)
                } else {
                  circleSvgHtml.addEventListener('contextmenu', this.goToRoot)
                }
                return
              }

              // Process Attendee Circles
              if (!circleNodeData) {
                this.$store
                  .dispatch('lookupAttendee', svgLabel.textContent)
                  .then(attendeeNodeData => {
                    if (attendeeNodeData && attendeeNodeData.img) {
                      const img = document.createElementNS(
                        'http://www.w3.org/2000/svg',
                        'image'
                      )
                      const fitImg = () => {
                        const circleDiameter =
                          circleSvg.getBBox({stroke: true}).height + 8
                        img.setAttribute('x', -(circleDiameter / 2))
                        img.setAttribute('y', -(circleDiameter / 2))
                        img.setAttribute('height', circleDiameter)
                        img.setAttribute('style', 'cursor: pointer')
                      }
                      img.setAttribute('href', attendeeNodeData.img)
                      img.setAttribute(
                        'clip-path',
                        `${clipPathEl.getAttribute('clip-path')}`
                      )
                      fitImg()

                      svgLabel.style.fillOpacity = 0
                      clipPathEl.parentElement.append(img)
                      setTimeout(() => {
                        fitImg()
                      }, 800)
                    }
                  })
              }
            })
        }, 4000)
      })
    }
  }
}

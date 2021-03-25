export default {
  data() {
    return {
      refreshTimer: null
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

    applyCssMods() {
      setTimeout(() => {
        const userName = this.$store.state.user.name
        const svgNodes = document.querySelectorAll('svg g text')
        Array.from(svgNodes).forEach(label => {
          this.$store
            .dispatch('lookupCircle', label.textContent)
            .then(isCircle => {
              const circleEl =
                label.parentElement.parentElement.parentElement
                  .firstElementChild
              circleEl.style = ''

              if (isCircle) {
                const el = document.getElementById(circleEl.id)
                el.removeEventListener('contextmenu', this.createCircle)
                if (
                  this.$store.state.currentCircle &&
                  label.textContent === this.$store.state.currentCircle.name
                ) {
                  el.addEventListener('contextmenu', this.createCircle)
                  setTimeout(() => {
                    el.dispatchEvent(new Event('click'))
                  }, 500)
                  el.style = 'stroke: var(--green); stroke-opacity: 1;'
                }
                return
              }

              if (userName === label.textContent) {
                circleEl.style = `stroke: var(--yellow); stroke-opacity: 1;`
              } else {
                // const attendee = this.findAttendee({name: label.textContent})
                // const img = document.createElement('img')
                // img.setAttribute('src', `${attendee.img}`)
                // label.append(img)
              }
            })
        }, 400)
      })
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
      }, 400)
    },

    isCircle(node) {
      return node && node.value > 2
    },

    goToRoot() {
      this.map.zoomReset()
      this.closeAllUserCards()
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
      return node.name
    },

    setTooltip(node) {
      return this.isCircle(node) ? `<u>${node.name || ''}</u>` : node.name || ''
    },

    setTooltipContent(node) {
      if (!node) return
      if (this.isCircle(node)) {
        return node.name === this.currentCircle.name
          ? 'Right-click to add an inner circle'
          : 'Click to join circle'
      } else {
        const user = this.findAttendee(node)
        return user
          ? `<p class='text-wrap mt-2 mb-n1'>${user.scratchpad || ''}</p>`
          : ''
      }
    }
  }
}

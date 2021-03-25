export default {
  methods: {
    initMap() {
      this.$store.commit('SET_LOADING', true)
      // Setup map
      const mapEl = document.getElementById('Map')
      this.map
        .data(this.nodes)
        .padding(80)
        .excludeRoot(true)
        .minCircleRadius(10)
        .width(window.width)
        .height(window.height)
        .color(this.setColor)
        .label(this.setLabel)
        .tooltipTitle(this.setTooltip)
        .tooltipContent(this.setTooltipContent)
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
                this.j(circleEl)
                if (
                  this.$store.state.currentCircle &&
                  label.textContent === this.$store.state.currentCircle.name
                ) {
                  circleEl.style = 'stroke: var(--green); stroke-opacity: 1;'
                }
                return
              }

              if (userName === label.textContent) {
                circleEl.style = `stroke: var(--yellow); stroke-opacity: 1;`
              } else {
                // const attendee = this.getAttendee({name: label.textContent})
                // const img = document.createElement('img')
                // img.setAttribute('src', `${attendee.img}`)
                // label.append(img)
              }
            })
        }, 1000)
      })
    },

    refreshChart() {
      this.map.data(this.nodes)
      this.applyCssMods()
      setTimeout(() => {
        const svgNodes = document.querySelectorAll('svg g text')
        Array.from(svgNodes).forEach((label, i) => {
          if (
            this.$store.state.currentCircle &&
            label.textContent === this.$store.state.currentCircle.name
          ) {
            const circleEl =
              label.parentElement.parentElement.parentElement.firstElementChild
                .id
            const el = document.getElementById(circleEl)
            el.dispatchEvent(new Event('click'))
          }
        })
      }, 2000)
    },

    isCircle(node) {
      return node && node.value > 2
    },

    async goToRoot() {
      this.map.zoomReset()
      await this.$store.dispatch('leaveCircle').then(() => {
        this.connections = null
        this.$store.commit('SET_CURRENT_CIRCLE', null)
      })
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

    getAttendee(node) {
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

    setTooltip(node) {
      const attendee = this.getAttendee(node)
      return !attendee || this.isCircle(node) ? `<h5>${node.name}</h5>` : ''
    },

    setTooltipContent(node) {
      const attendee = this.getAttendee(node)
      return !attendee || this.isCircle(node)
        ? ''
        : `
      <img
        src="${attendee.img}"
        width="100%"
        class="rounded ${attendee.img ? '' : 'd-none'}"
      />
      <div class="text">
        <h5>${attendee.name}</h5>
        <p class="rounded ${attendee.img ? '' : 'd-none'}">
          ${attendee.scratchpad || ''}
        </p>
      </div>
      `
    }
  }
}

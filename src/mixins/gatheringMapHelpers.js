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
        //.onHover()
        .onClick(this.nodeClick)(mapEl)
      this.$store.commit('SET_LOADING', false)
    },
    refreshChart() {
      this.map.data(this.nodes)
    },
    isCircle(node) {
      return node && node.value > 2
    },
    goToRoot() {
      this.map.zoomReset()
      this.connections = null
      this.$store.commit('SET_CURRENT_CIRCLE', null)
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
      <img src="${attendee.avatar}" width="100%" class="rounded" />
      <div class="text">
        <h5>${attendee.name}</h5>
        <p>${attendee.scratchpad}</p>
      </div>
      `
    }
  }
}

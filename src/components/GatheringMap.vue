<template>
  <div>
    <div style="opacity:.95" @click="goToRoot">
      <div id="Map" />
      <div v-if="false && connections">
        <div v-for="con in connections" :key="con.name">
          <WebRtcConnection :room="con.name" :listen-only="con.listenOnly" />
        </div>
      </div>
    </div>
    <CreateCircleModal @updated="refreshChart" />
  </div>
</template>

<script>
import CirclePack from 'circlepack-chart'
import WebRtcConnection from '@/components/WebRtcConnection.vue'
import CreateCircleModal from '@/components/modals/CreateCircleModal.vue'

export default {
  name: 'GatheringMap',
  components: {
    WebRtcConnection,
    CreateCircleModal
  },
  data() {
    return {
      map: new CirclePack(),
      connections: []
    }
  },

  computed: {
    nodes() {
      return this.$store.getters.gatheringNodes
    },
    currentCircle() {
      return this.$store.state.currentCircle
    }
  },

  watch: {
    '$store.state.gathering': {
      deep: true,
      handler() {
        this.refreshChart()
      }
    }
  },

  mounted() {
    this.initMap()
  },

  methods: {
    initMap() {
      this.$store.commit('SET_LOADING', true)
      // Setup map
      const mapEl = document.getElementById('Map')
      this.map
        .data(this.nodes)
        .padding(80)
        .excludeRoot(true)
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
          return '#6945DF'
        default:
          return '#df456e'
      }
    },
    setLabel(node) {
      return node.name
    },
    getAttendee(node) {
      if (!this.$store.state.currentCircle) {
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
    },
    nodeClick(node) {
      this.isCircle(node) ? this.circleClick(node) : this.showUserCard(node)
    },
    showUserCard(node) {
      console.log(node.name)
      return
    },
    circleClick(node) {
      if (!this.currentCircle) {
        this.joinCircle(node)
        return
      }
      const isCurrentCircle = this.$store.state.currentCircle.name === node.name
      const canCreateCircle =
        this.$store.state.currentCircle.allowChildren ||
        this.$store.getters.isAdmin
      isCurrentCircle && canCreateCircle
        ? this.createCircle()
        : this.joinCircle(node)
    },
    createCircle() {
      this.$bvModal.show('create-circle-modal')
    },
    async joinCircle(node) {
      const circle = await this.$store.dispatch('lookupCircle', node.name)
      this.$store.commit('SET_CURRENT_CIRCLE', circle)
      this.connections = [{name: node.name}]
      if (this.$store.getters.currentParent) {
        this.connections.push({
          name: this.$store.getters.currentParent.name,
          listenOnly: true
        })
      }
      this.map.zoomToNode(node)
    },
    makeAttendeeAdmin(id) {
      this.$store.dispatch('addToAdmins', id)
    }
  }
}
</script>
<style>
/* circlepack overwrite classes */
g {
  clip-path: none !important;
}
.circlepack-viz circle {
  stroke-width: 0.2rem !important;
  stroke: #4a4453;
}
.circlepack-viz circle:hover {
  stroke: #006efe;
}
.circlepack-viz .label-container {
  margin-top: -120px !important;
}
.circlepack-viz .path-label {
  font-size: 1.3rem;
  white-space: normal;
}
@media screen and (max-width: 600px) {
  .circlepack-viz .path-label {
    font-size: 1rem !important;
  }
}
.chart-tooltip,
.circlepack-tooltip {
  font-size: 1rem;
  margin-top: 3px;
  width: max-content;
  height: fit-content;
  max-height: 60%;
  padding: 24px !important;
  background: #1f191ecc;
  border-radius: 8px !important;
}
.circlepack-tooltip .tooltip-title {
  font-size: 1.5rem;
  width: max-content;
  margin: 0;
}
.chart-tooltip .text {
  padding-top: 8px;
  height: auto !important;
  white-space: normal;
}
</style>

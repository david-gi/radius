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
import {User, Gathering, Circle} from '../models/index'
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
      connections: [],
      backgroundStyle: `
          background-image: url(${this.$store.state.gathering.imgUrl});
          background-size: cover;
          background-position: fixed;
        `
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
        //.tooltipTitle(this.setTooltip)
        .tooltipContent(this.setTooltipContent)
        //.onHover()
        .onClick(this.nodeClick)(mapEl)
    },
    refreshChart() {
      this.map.data(this.nodes)
    },
    isCircle(node) {
      return Number(node.value) === 3
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
    setTooltip(node) {
      const participant =
        this.$store.state.currentCircle &&
        this.$store.state.currentCircle.participants.find(
          p => p.id === node.name
        )
      return !participant || this.isCircle(node)
        ? `<h5>${node.name}</h5>`
        : `<strong>${participant.name}</strong>`
    },
    setTooltipContent(node) {
      let participant
      if (
        this.$store.state.currentCircle &&
        this.$store.state.currentCircle.participants
      ) {
        participant = this.$store.state.currentCircle.participants.find(
          p => p.name === node.name
        )
      }
      return !participant || this.isCircle(node)
        ? ''
        : `<p>${participant.scratchpad}</p>`
    },
    nodeClick(node) {
      this.isCircle(node) ? this.circleClick(node) : this.showUserCard(node)
    },
    showUserCard(node) {
      alert(node.name)
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
    makeParticipantAdmin(id) {
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
}
@media screen and (max-width: 600px) {
  .circlepack-viz .path-label {
    font-size: 1rem !important;
  }
}
.chart-tooltip,
.circlepack-tooltip {
  padding: 0 !important;
  border-radius: 8px !important;
  background: transparent !important;
}
.circlepack-tooltip .tooltip-title {
  font-size: 1.5rem;
  margin: 0;
  width: fit-content;
  padding: 12px !important;
  background: #1b191fcc;
  border-radius: 8px !important;
}
</style>
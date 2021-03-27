<template>
  <div :class="{joined: currentCircle}" class="faded">
    <div>
      <div id="Map" />
      <div v-if="!$store.state.loading && !cConnections">
        <div v-for="con in cConnections" :key="con.name">
          <WebRtcConnection
            :room="$store.state.gathering.id + con.name"
            :listen-only="con.listenOnly"
          />
        </div>
      </div>
    </div>
    <CreateCircleModal @updated="refreshChart" />
  </div>
</template>

<script>
import CirclePack from 'circlepack-chart'
import coreGatheringMap from '../mixins/coreGatheringMap'
import WebRtcConnection from '@/components/WebRtcConnection.vue'
import CreateCircleModal from '@/components/modals/CreateCircleModal.vue'

export default {
  name: 'GatheringMap',
  components: {
    WebRtcConnection,
    CreateCircleModal
  },
  mixins: [coreGatheringMap],
  data() {
    return {
      map: new CirclePack(),
      connections: null,
      debounceCount: null,
      debounceTimer: null
    }
  },

  computed: {
    nodes() {
      return this.$store.getters.gatheringNodes
    },
    currentCircle() {
      return this.$store.state.currentCircle
    },
    cConnections() {
      return this.connections
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

  created() {
    window.addEventListener('beforeunload', this.exit)
  },

  mounted() {
    this.initMap()
    window.addEventListener('beforeunload', this.exit)
  },

  beforeRouteLeave() {
    this.exit()
  },

  beforeDestroy() {
    window.removeEventListener('beforeunload', this.exit)
  },

  methods: {
    exit() {
      this.$store.dispatch('leaveCurrentCircle')
      this.$store.dispatch('leaveGathering')
    },

    nodeClick(node) {
      if (++this.debounceCount > 1) {
        clearTimeout(this.debounceTimer)
        this.debounceTimer = setTimeout(() => {
          this.debounceCount = 0
        }, 500)
        return
      }
      if (!node) {
        if (this.currentCircle) this.goToRoot()
        return
      }
      if (
        this.isCircle(node) &&
        (!this.currentCircle || this.currentCircle.name !== node.name)
      ) {
        this.map.zoomToNode(node)
        this.enterCircle(node)
      }
    },

    async enterCircle(node) {
      const circle = await this.$store.dispatch('lookupCircle', node.name)
      if (
        circle.attendees &&
        circle.attendees.length >= this.$store.state.circleSize
      ) {
        this.$store.dispatch('displayMessage', {
          msg: 'This circle is full (25 max).'
        })
        return
      }

      this.$store.dispatch('joinCircle', circle).then(() => {
        this.connections = [{name: node.name, listenOnly: false}]
        if (node.x && this.$store.getters.currentParent) {
          this.connections.push({
            name: this.$store.getters.currentParent.name,
            listenOnly: true
          })
        }
      })
    },

    createCircle(e) {
      e.preventDefault()
      if (
        this.currentCircle &&
        this.currentCircle.parentPath &&
        this.currentCircle.parentPath.split('/').length > 6
      ) {
        this.$store.dispatch('displayMessage', {
          msg: 'Max circle depth reached (3 max).'
        })
        return
      }
      this.$bvModal.show('create-circle-modal')
      return false
    }

  }
}
</script>
<style>
/* circlepack overwrite classes */
svg {
  cursor: default !important;
}
.joined svg {
  cursor: alias !important;
}
g {
  clip-path: none !important;
}
.circlepack-viz circle {
  stroke-width: 0.4rem !important;
  stroke: var(--dark);
  stroke-opacity: 1;
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

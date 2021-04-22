<template>
  <div class="faded">
    <div>
      <div id="Map" />
      <div v-if="!$store.state.loading && cConnections">
        <div v-for="con in cConnections" :key="con.name">
          <WebRtcConnection
            :room="$store.state.gathering.id + con.name"
            :listen-only="con.listenOnly"
          />
        </div>
      </div>
    </div>
    <CreateCircleModal @updated="refreshChart" />
    <TheToolbar
      @leave-circle="this.goToRoot"
      @reset-zoom="this.map.zoomReset"
      @circle-zoom="this.zoomToCurrent"
      @add-circle="this.createCircle"
    />
  </div>
</template>

<script>
import CirclePack from 'circlepack-chart'
import coreGatheringMap from '../mixins/coreGatheringMap'
import WebRtcConnection from '@/components/WebRtcConnection.vue'
import TheToolbar from '@/components/TheToolbar.vue'
import CreateCircleModal from '@/components/modals/CreateCircleModal.vue'

export default {
  name: 'GatheringMap',
  components: {
    WebRtcConnection,
    TheToolbar,
    CreateCircleModal
  },
  mixins: [coreGatheringMap],
  data() {
    return {
      map: new CirclePack(),
      connections: null,
      debounceCount: 0
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
    window.addEventListener('resize', this.resizeChart)
    window.addEventListener('beforeunload', this.exit)
  },

  mounted() {
    this.initMap()
  },

  beforeRouteLeave() {
    this.exit()
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart)
    window.removeEventListener('beforeunload', this.exit)
  },

  methods: {
    async exit() {
      await this.$store.dispatch('leaveCurrentCircle')
      await this.$store.dispatch('leaveGathering')
    },

    nodeClick(node) {
      if (this.$store.state.loading) return
      if (++this.debounceCount < 2) {
        if (node) {
          this.goToNode(node)
        }
        setTimeout(() => {
          this.debounceCount = 0
        }, 200)
        return
      }
      if (
        this.isCircle(node) &&
        (!this.currentCircle || this.currentCircle.name !== node.name)
      ) {
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
        document.getElementsByTagName('audio').forEach(a => {
          a.remove()
        })
        this.connections = [{name: node.name, listenOnly: false}]
        if (this.$store.getters.currentParent) {
          this.connections.push({
            name: this.$store.getters.currentParent.name,
            listenOnly: true
          })
        }
      })
    },

    createCircle() {
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
  cursor: pointer !important;
}
g {
  clip-path: none !important;
}
.circlepack-viz circle {
  stroke-width: 0.6rem !important;
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
  min-width: fit-content;
  height: fit-content;
  max-height: 60%;
  padding: 24px !important;
  background: #181317cc;
  border-radius: 8px !important;
}
.circlepack-tooltip .tooltip-title {
  font-size: 1.5rem;
  margin: 0;
  padding: 0;
}
.chart-tooltip .text {
  padding-top: 8px;
  height: auto !important;
  white-space: normal;
}
</style>

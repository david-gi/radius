<template>
  <div :class="{joined: currentCircle}">
    <div style="opacity:.95;">
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
import gatheringMapHelpers from '../mixins/gatheringMapHelpers'
import WebRtcConnection from '@/components/WebRtcConnection.vue'
import CreateCircleModal from '@/components/modals/CreateCircleModal.vue'

export default {
  name: 'GatheringMap',
  components: {
    WebRtcConnection,
    CreateCircleModal
  },
  mixins: [gatheringMapHelpers],
  data() {
    return {
      map: new CirclePack(),
      connections: [],
      circleDoubleClick: 0
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
      alert()
      this.$store.dispatch('leaveCircle')
      this.$store.dispatch('leaveGathering')
    },
    nodeClick(node) {
      if (!node) {
        this.goToRoot()
        return
      }
      this.isCircle(node) ? this.circleClick(node) : this.showUserCard(node)
    },
    showUserCard(node) {
      return
      // const attendee = this.getAttendee(node)
      // const h = this.$createElement
      // const hasImg = Boolean(attendee.img)
      // const vNodesMsg = h('div', {class: ['text-center', 'align-center']}, [
      //   h('b-img', {
      //     props: {src: `${attendee.img}`, fluid: ''},
      //     class: [
      //       'rounded',
      //       'border',
      //       'border-dark',
      //       'w-100',
      //       hasImg ? '' : 'd-none'
      //     ]
      //   }),
      //   h('div', {class: ['text-white', 'pt-1']}, [
      //     h('h5', {}, attendee.name),
      //     h(
      //       'p',
      //       {class: ['rounded', hasImg ? '' : 'd-none']},
      //       attendee.scratchpad || ''
      //     )
      //   ])
      // ])

      // this.$bvToast.toast([vNodesMsg], {
      //   title: '',
      //   variant: ' ',
      //   isStatus: true,
      //   toastClass: 'm-0 bg-dark rounded',
      //   headerClass: 'd-none',
      //   toaster: 'b-toaster-bottom-right',
      //   appendToast: true
      // })
    },
    circleClick(node) {
      this.map.zoomToNode(node)
      setTimeout(() => {
        this.circleDoubleClick = 0
      }, 500)
      if (++this.circleDoubleClick < 2) return

      if (!this.currentCircle) {
        this.joinCircle(node)
        return
      }
      const isCurrentCircle = this.$store.state.currentCircle.name === node.name
      isCurrentCircle ? this.createCircle() : this.joinCircle(node)
    },
    createCircle() {
      if (
        this.$store.state.currentCircle &&
        this.$store.state.currentCircle.parentPath &&
        this.$store.state.currentCircle.parentPath.split('/').length > 6
      ) {
        // this.$store.dispatch('displayMessage', {
        //   msg: 'Max circle depth reached (3 max).'
        // })
        return
      }
      this.$bvModal.show('create-circle-modal')
    },
    async joinCircle(node) {
      const circle = await this.$store.dispatch('lookupCircle', node.name)

      // eslint-disable-next-line no-constant-condition
      if (
        circle.attendees &&
        circle.attendees.length >= this.$store.state.circleSize
      ) {
        this.$store.dispatch('displayMessage', {
          msg: 'This circle is full (25 max).'
        })
        return
      }
      await this.$store.dispatch('leaveCircle')
      await this.$store.commit('SET_CURRENT_CIRCLE', circle)
      this.connections = [{name: node.name}]
      if (this.$store.getters.currentParent) {
        this.connections.push({
          name: this.$store.getters.currentParent.name,
          listenOnly: true
        })
      }
      await this.$store.dispatch('joinCircle')
      // setTimeout(() => {
      //   this.map.zoomToNode(node)
      // }, 600)
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
  stroke-width: 0.2rem !important;
  stroke: #1a1e14;
}
.circlepack-viz circle:hover {
  stroke: #ceea1e;
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

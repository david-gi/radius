<template>
  <div @click="goToRoot">
    <div id="Map" />

    <CircleMenu />

    <div v-for="con in connections" :key="con.name">
      <WebRtcConnection :room="con.name" :listen-only="con.listenOnly" />
    </div>
  </div>
</template>

<script>
import CirclePack from 'circlepack-chart'
import CircleMenu from '@/components/CircleMenu.vue'
import WebRtcConnection from '@/components/WebRtcConnection.vue'

export default {
  name: 'GatheringMap',
  components: {
    CircleMenu,
    WebRtcConnection
  },
  data() {
    return {
      map: new CirclePack(),
      connections: []
    }
  },

  computed: {
    nodes: () => this.$store.getters.gatheringNodes,
    currentCircle: this.$store.state.currentCircle
  },

  mounted() {
    const mapEl = document.getElementById('Map')
    this.map
      .data(this.nodes)
      .color(node => {
        switch (node.value) {
          case 1:
            return '#45DFB6' // teal
          case 2:
            return '#6945DF' // purple
          default:
            return '#df456e' // pink
        }
      })
      .height(window.innerHeight)
      .width(window.innerWidth)
      .excludeRoot(true)
      .tooltipTitle(node => node.name + ' - Tooltip')
      .label(node => node.name + ' - Label')
      .padding(80)
      //.onHover()
      .onClick(this.circleClick)(mapEl)
  },

  methods: {
    goToRoot() {
      this.map.zoomReset()
      this.currentCircle = null
    },
    showCircleMenu(node) {
      // open menu: un/mute, join, create
      alert(node.name)
    },
    showUserCard(userId) {
      alert(userId)
    },
    circleClick(node) {
      node.value === 3
        ? this.showCircleMenu(node)
        : this.showUserCard(node.name)
    },
    makeParticipantAdmin(id) {
      this.$store.dispatch('/addToAdmins', id)
    },
    joinCircle(node) {
      if (this.currentCircle.children.find(c => c.id === node.name)){
        this.connections.push({
          name: node.name,
          listenOnly: true
        })
      }
      this.connections = [{name: node.name}]
      this.map.zoomToNode(node)
      this.currentCircle = node
    }
  }
}
</script>

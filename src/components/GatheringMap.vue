<template>
  <Background>
    <div style="opacity:.95" @click="goToRoot">
      <div id="Map" />
      <div v-for="con in connections" :key="con.name">
        <WebRtcConnection :room="con.name" :listen-only="con.listenOnly" />
      </div>
    </div>
  </Background>
</template>

<script>
import {User, Gathering, Circle} from '../models/index'
import CirclePack from 'circlepack-chart'
import Background from '@/components/Background.vue'
import WebRtcConnection from '@/components/WebRtcConnection.vue'

export default {
  name: 'GatheringMap',
  components: {
    Background,
    WebRtcConnection
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

  mounted() {
    // Setup map
    const mapEl = document.getElementById('Map')
    this.map
      .data(this.nodes)
      .padding(80)
      .excludeRoot(true)
      .width(window.innerWidth)
      .height(window.innerHeight)
      .color(this.setColor)
      .label(this.setLabel)
      //.tooltipTitle(this.setTooltip)
      .tooltipContent(this.setTooltipContent)
      //.onHover()
      .onClick(this.nodeClick)(mapEl)
  },

  methods: {
    isCircle(node) {
      return Number(node.value) === 3
    },
    goToRoot() {
      this.map.zoomReset()
      this.$store.commit('SET_CURRENT_CIRCLE', null)
    },
    setColor(node) {
      switch (node.value) {
        case 3:
          return '#6945DF'
        default:
          return '#df456e' //'#006EFE'
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
      this.isCircle(node)
        ? this.circleClick(node)
        : this.showUserCard(node.name)
    },

    circleClick(node) {
      if (!this.currentCircle) {
        this.joinCircle(node)
        return
      }
      const isCurrentCircle = this.$store.state.currentCircle.id === node.name
      const canCreateCircle =
        this.$store.state.currentCircle.allowChildren ||
        this.$store.getters.isAdmin
      isCurrentCircle && canCreateCircle
        ? this.createCircle()
        : this.joinCircle(node)
    },
    createCircle() {
      const circle = new Circle()
      this.$store.dispatch('addCircle', circle)
    },
    joinCircle(node) {
      if (
        this.currentCircle &&
        this.currentCircle.children &&
        this.currentCircle.children.find(c => c.id === node.name)
      ) {
        this.connections.push({
          name: node.name,
          listenOnly: true
        })
      }
      this.connections = [{name: node.name}]
      this.map.zoomToNode(node)
      this.$store.commit('SET_CURRENT_CIRCLE', node)
    },
    makeParticipantAdmin(id) {
      this.$store.dispatch('addToAdmins', id)
    }
  }
}
</script>

<template>
  <div @dblclick="resetZoom">
    {{ currentRoom }}!
    <div id="Map" />
    <WebRtcRoom v-if="currentRoom" :room="currentRoom" />
  </div>
</template>

<script>
import CirclePack from 'circlepack-chart'
import WebRtcRoom from '@/components/WebRtcRoom.vue'

export default {
  name: 'CirclePackMap',
  data() {
    return {
      map: new CirclePack(),
      rooms: null,
      currentRoom: 'Lobby'
    }
  },
  components: {
    WebRtcRoom
  },
  mounted() {
    const data = {
      name: 'Lobby',
      color: 'pink',
      children: [
        {name: 'Room1', color: 'blue', value: 1},
        {name: 'Room2', color: 'purple', value: 1},
        {
          name: 'Room3',
          color: 'purple',
          value: 1,
          children: [
            {name: 'RoomA', color: 'blue', value: 1},
            {name: 'RoomB', color: 'purple', value: 1}
          ]
        }
      ]
    }
    const mapEl = document.getElementById('Map')
    this.map
      .data(data)
      .color('color')
      .padding(20)
      .color('black')
      .onClick(this.circleClick)(mapEl)
  },
  methods: {
    resetZoom() {
      this.map.zoomReset()
    },
    circleClick(node) {
      const isRoom = node.value === 1
      if (isRoom) {
        this.currentRoom = node.name
      }
      this.map.zoomToNode(node)
    }
  }
}
</script>
